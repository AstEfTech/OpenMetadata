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

import { Typography } from 'antd';
import React from 'react';
import {
  default as AddPlaceHolder,
  default as NoDataFoundPlaceHolder,
} from '../../../assets/img/no-data-placeholder.svg';
import { Button } from '../../buttons/Button/Button';

type Props = {
  children?: React.ReactNode;
  type?: string;
  buttonLabel?: string;
  buttonListener?: () => void;
  heading?: string;
  doc?: string;
  buttons?: React.ReactNode;
};

const ErrorPlaceHolder = ({
  doc,
  type,
  children,
  heading,
  buttonLabel,
  buttonListener,
  buttons,
}: Props) => {
  const { Paragraph, Link } = Typography;

  return type === 'ADD_DATA' ? (
    <div>
      <div className="flex-center flex-col tw-mt-24 " data-testid="error">
        {' '}
        <img data-testid="no-data-image" src={AddPlaceHolder} width="100" />
      </div>
      <div className="tw-flex tw-flex-col tw-items-center tw-mt-10 tw-text-base tw-font-medium">
        <Paragraph style={{ marginBottom: '4px' }}>
          {' '}
          Adding a new {heading} is easy, just give it a spin!
        </Paragraph>
        <Paragraph>
          {' '}
          Still need help? Refer to our{' '}
          <Link href={doc} target="_blank">
            docs
          </Link>{' '}
          for more information.
        </Paragraph>

        <div className="tw-text-lg tw-text-center">
          {buttons ? (
            buttons
          ) : (
            <Button
              data-testid="add-service-button"
              size="small"
              theme="primary"
              variant="outlined"
              onClick={buttonListener}>
              {buttonLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div>
      <div className="flex-center flex-col tw-mt-24 " data-testid="error">
        {' '}
        <img
          data-testid="no-data-image"
          src={NoDataFoundPlaceHolder}
          width="100"
        />
      </div>
      {children && (
        <div className="tw-flex tw-flex-col tw-items-center tw-mt-10 tw-text-base tw-font-medium">
          {children}
        </div>
      )}
    </div>
  );
};

export default ErrorPlaceHolder;
