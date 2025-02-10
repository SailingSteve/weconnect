import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';


const PersonSummaryHeader = () => {
  renderLog('PersonHeader');  // Set LOG_RENDER_EVENTS to log all renders

  return (
    <OnePersonHeader>
      {/* Width (below) of this PersonHeaderCell comes from the combined widths of the first x columns in PersonMemberList */}
      <PersonHeaderCell largefont="true" titlecell="true" cellwidth={200}>
        &nbsp;
      </PersonHeaderCell>
      <PersonHeaderCell cellwidth={300}>
        Location
      </PersonHeaderCell>
      <PersonHeaderCell cellwidth={190}>
        Title / Volunteering Love
      </PersonHeaderCell>
      {/* Edit icon */}
      <PersonHeaderCell cellwidth={20} />
    </OnePersonHeader>
  );
};

const OnePersonHeader = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
`;

const PersonHeaderCell = styled('div', {
  shouldForwardProp: (prop) => !['largefont', 'titlecell', 'cellwidth'].includes(prop),
})(({ largefont, titlecell, cellwidth }) => (`
  align-content: center;
  ${(titlecell) ? '' : 'border-bottom: 1px solid #ccc;'}
  ${(largefont) ? 'font-size: 1.1em;' : 'font-size: .8em;'};
  ${(titlecell) ? '' : 'font-weight: 550;'}
  height: 22px;
  ${cellwidth ? `max-width: ${cellwidth}px;` : ''}
  ${cellwidth ? `min-width: ${cellwidth}px;` : ''}
  overflow: hidden;
  white-space: nowrap;
  ${cellwidth ? `width: ${cellwidth}px;` : ''}
`));

export default PersonSummaryHeader;
