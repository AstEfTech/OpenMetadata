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
import {
  Suggestion,
  SuggestionType,
} from '../../../generated/entity/feed/suggestion';
import { EntityReference } from '../../../generated/entity/type';

export interface SuggestionsContextType {
  selectedUserSuggestions: Suggestion[];
  suggestions: Suggestion[];
  suggestionsByUser: Map<string, Suggestion[]>;
  loading: boolean;
  loadingAccept: boolean;
  loadingReject: boolean;
  allSuggestionsUsers: EntityReference[];
  onUpdateActiveUser: (user?: EntityReference) => void;
  fetchSuggestions: (entityFqn: string) => void;
  acceptRejectSuggestion: (
    suggestion: Suggestion,
    action: SuggestionAction
  ) => void;
  acceptRejectAllSuggestions: (
    suggestionType: SuggestionType,
    status: SuggestionAction
  ) => void;
}

export enum SuggestionAction {
  Accept = 'accept',
  Reject = 'reject',
}
