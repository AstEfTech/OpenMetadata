/*
 *  Copyright 2021 Collate
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package org.openmetadata.service.util;

import static org.openmetadata.schema.type.EventType.ENTITY_CREATED;
import static org.openmetadata.schema.type.EventType.ENTITY_NO_CHANGE;
import static org.openmetadata.schema.type.EventType.ENTITY_RESTORED;
import static org.openmetadata.schema.type.EventType.ENTITY_UPDATED;
import static org.openmetadata.schema.type.EventType.LOGICAL_TEST_CASE_ADDED;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.TimeZone;
import java.util.UUID;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;
import lombok.Getter;
import org.openmetadata.common.utils.CommonUtil;
import org.openmetadata.schema.type.ChangeEvent;
import org.openmetadata.schema.type.EventType;

public final class RestUtil {
  public static final String CHANGE_CUSTOM_HEADER = "X-OpenMetadata-Change";
  public static final String SIGNATURE_HEADER = "X-OM-Signature";
  public static final DateFormat DATE_TIME_FORMAT;
  public static final DateFormat DATE_FORMAT;

  static {
    // Quoted "Z" to indicate UTC, no timezone offset
    DATE_TIME_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'");
    DATE_TIME_FORMAT.setTimeZone(TimeZone.getTimeZone("UTC"));

    DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");
    DATE_FORMAT.setTimeZone(TimeZone.getTimeZone("UTC"));
  }

  private RestUtil() {}

  /** Remove leading and trailing slashes */
  public static String removeSlashes(String s) {
    s = s.startsWith("/") ? s.substring(1) : s;
    s = s.endsWith("/") ? s.substring(0, s.length() - 1) : s;
    return s;
  }

  public static URI getHref(UriInfo uriInfo, String collectionPath) {
    collectionPath = removeSlashes(collectionPath);
    String uriPath = uriInfo.getBaseUri() + collectionPath;
    return URI.create(uriPath);
  }

  public static URI getHref(URI parent, String child) {
    child = removeSlashes(child);
    child = replaceSpaces(child);
    return URI.create(parent.toString() + "/" + child);
  }

  public static String replaceSpaces(String s) {
    s = s.replace(" ", "%20");
    return s;
  }

  public static URI getHref(UriInfo uriInfo, String collectionPath, String resourcePath) {
    collectionPath = removeSlashes(collectionPath);
    resourcePath = removeSlashes(resourcePath);
    URI uri = getHref(uriInfo, collectionPath);
    return getHref(uri, resourcePath);
  }

  public static URI getHref(UriInfo uriInfo, String collectionPath, UUID id) {
    return getHref(uriInfo, collectionPath, id.toString());
  }

  public static int compareDates(String date1, String date2) throws ParseException {
    return DATE_FORMAT.parse(date1).compareTo(DATE_FORMAT.parse(date2));
  }

  public static String today(int offsetDays) {
    Date date = CommonUtil.getDateByOffset(new Date(), offsetDays);
    return DATE_FORMAT.format(date);
  }

  public static void validateCursors(String before, String after) {
    if (before != null && after != null) {
      throw new IllegalArgumentException("Only one of before or after query parameter allowed");
    }
  }

  public static String encodeCursor(String cursor) {
    return cursor == null
        ? null
        : Base64.getUrlEncoder().encodeToString(cursor.getBytes(StandardCharsets.UTF_8));
  }

  public static String decodeCursor(String cursor) {
    return cursor == null ? null : new String(Base64.getUrlDecoder().decode(cursor));
  }

  public static class PutResponse<T> {
    @Getter private T entity;
    private ChangeEvent changeEvent;
    @Getter private final Response.Status status;
    private final EventType changeType;

    /**
     * Response.Status.CREATED when PUT operation creates a new entity or Response.Status.OK when PUT operation updates
     * a new entity
     */
    public PutResponse(Response.Status status, T entity, EventType changeType) {
      this.entity = entity;
      this.status = status;
      this.changeType = changeType;
    }

    /** When PUT response updates an entity */
    public PutResponse(Response.Status status, ChangeEvent changeEvent, EventType changeType) {
      this.changeEvent = changeEvent;
      this.status = status;
      this.changeType = changeType;
    }

    public Response toResponse() {
      ResponseBuilder responseBuilder =
          Response.status(status).header(CHANGE_CUSTOM_HEADER, changeType);
      if (changeType.equals(ENTITY_CREATED)
          || changeType.equals(ENTITY_UPDATED)
          || changeType.equals(ENTITY_NO_CHANGE)
          || changeType.equals(ENTITY_RESTORED)
          || changeType.equals(LOGICAL_TEST_CASE_ADDED)) {
        return responseBuilder.entity(entity).build();
      } else {
        return responseBuilder.entity(changeEvent).build();
      }
    }
  }

  public record PatchResponse<T>(Status status, T entity, EventType changeType) {
    public Response toResponse() {
      return Response.status(status)
          .header(CHANGE_CUSTOM_HEADER, changeType.value())
          .entity(entity)
          .build();
    }
  }

  public record DeleteResponse<T>(T entity, EventType changeType) {
    public Response toResponse() {
      ResponseBuilder responseBuilder =
          Response.status(Status.OK).header(CHANGE_CUSTOM_HEADER, changeType.value());
      return responseBuilder.entity(entity).build();
    }
  }
}
