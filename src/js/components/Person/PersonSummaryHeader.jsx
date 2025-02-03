import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';


const PersonSummaryHeader = () => {
  renderLog('PersonHeader');  // Set LOG_RENDER_EVENTS to log all renders

  return (
    <OnePersonHeader>
      {/* Width (below) of this PersonHeaderCell comes from the combined widths of the first x columns in PersonMemberList */}
      <PersonHeaderCell $largeFont $titleCell cellwidth={200}>
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
  shouldForwardProp: (prop) => !['largeFont', 'titleCell', 'cellwidth'].includes(prop),
})(({ largeFont, titleCell, cellwidth }) => (`
  align-content: center;
  ${(titleCell) ? '' : 'border-bottom: 1px solid #ccc;'}
  ${(largeFont) ? 'font-size: 1.1em;' : 'font-size: .8em;'};
  ${(titleCell) ? '' : 'font-weight: 550;'}
  height: 22px;
  ${cellwidth ? `max-width: ${cellwidth}px;` : ''};
  ${cellwidth ? `min-width: ${cellwidth}px;` : ''};
  overflow: hidden;
  white-space: nowrap;
  ${cellwidth ? `width: ${cellwidth}px;` : ''};
`));

export default PersonSummaryHeader;
