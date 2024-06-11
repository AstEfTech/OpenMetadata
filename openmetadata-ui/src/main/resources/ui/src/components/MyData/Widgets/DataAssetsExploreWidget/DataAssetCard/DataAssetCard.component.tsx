/*
 *  Copyright 2024 Collate.
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
import { Card, Col, Row, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { getExplorePath } from '../../../../../constants/constants';
import { ExplorePageTabs } from '../../../../../enums/Explore.enum';
import { ServicesType } from '../../../../../interface/service.interface';
import { getServiceLogo } from '../../../../../utils/CommonUtils';
import { getEntityName } from '../../../../../utils/EntityUtils';
import RichTextEditorPreviewer from '../../../../common/RichTextEditor/RichTextEditorPreviewer';

interface DataAssetCardProps {
  service: ServicesType;
}

const DataAssetCard = ({ service }: DataAssetCardProps) => {
  const history = useHistory();
  const { t } = useTranslation();

  const handleRedirect = () => {
    history.push(
      getExplorePath({
        tab: ExplorePageTabs.TOPICS,
        extraParameters: {
          page: '1',
          quickFilter: JSON.stringify({
            query: {
              bool: {
                must: [
                  {
                    bool: {
                      should: [
                        {
                          term: {
                            'service.displayName.keyword':
                              service.fullyQualifiedName,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          }),
        },
      })
    );
  };

  return (
    <Card className="w-full" size="small" onClick={handleRedirect}>
      <div
        className="d-flex justify-between text-grey-muted"
        data-testid="service-card">
        <div
          className="d-flex justify-center items-center"
          data-testid="service-icon">
          {getServiceLogo(service.serviceType || '', 'h-8')}
        </div>
        <Row className="m-l-xs" gutter={[0, 6]}>
          <Col span={24}>
            <Typography.Text
              className="text-base text-grey-body font-medium truncate w-48 d-inline-block"
              data-testid={`service-name-${service.name}`}
              title={getEntityName(service)}>
              {getEntityName(service)}
            </Typography.Text>
            <div
              className="text-grey-body break-all description-text"
              data-testid="service-description">
              {service.description ? (
                <RichTextEditorPreviewer
                  className="max-two-lines"
                  enableSeeMoreVariant={false}
                  markdown={service.description}
                />
              ) : (
                <span className="text-grey-muted">
                  {t('label.no-description')}
                </span>
              )}
            </div>
          </Col>
          <Col span={24}>
            <div className="m-b-xss" data-testid="service-type">
              <label className="m-b-0">{`${t('label.type')}:`}</label>
              <span className="font-normal m-l-xss text-grey-body">
                {service.serviceType}
              </span>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default DataAssetCard;
