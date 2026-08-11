'use strict';

var designSystem = require('@strapi/design-system');
var styledComponents = require('styled-components');

// TODO: find a better naming convention for the file that was an index file before
const RelativeBox = styledComponents.styled(designSystem.Box)`
  position: relative;
`;
const Wrapper = styledComponents.styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  background: repeating-conic-gradient(
      ${({ theme })=>theme.colors.neutral100} 0% 25%,
      transparent 0% 50%
    )
    50% / 20px 20px;

  svg {
    height: 26px;
  }

  img,
  mux-player {
    margin: 0;
    padding: 0;
    max-height: 26.4rem;
    max-width: 100%;
  }

  mux-player {
    --play-button: inline-flex;
    --mute-button: inline-flex;
    --pip-button: inline-flex;
    --fullscreen-button: inline-flex;
    --playback-rate-button: inline-flex;
    --volume-range: inline-flex;
    --time-range: inline-flex;
    --time-display: inline-flex;
    --duration-display: inline-flex;
  }
`;
const ActionRow = styledComponents.styled(designSystem.Flex)`
  height: 5.2rem;
  background-color: ${({ $blurry })=>$blurry ? `rgba(33, 33, 52, 0.4)` : undefined};
`;
const CroppingActionRow = styledComponents.styled(designSystem.Flex)`
  z-index: 1;
  height: 5.2rem;
  position: absolute;
  background-color: rgba(33, 33, 52, 0.4);
  width: 100%;
`;
// TODO: fix in parts, this shouldn't happen
const BadgeOverride = styledComponents.styled(designSystem.Badge)`
  span {
    color: inherit;
    font-weight: ${({ theme })=>theme.fontWeights.regular};
  }
`;
const UploadProgressWrapper = styledComponents.styled.div`
  position: absolute;
  z-index: 2;
  height: 100%;
  width: 100%;
`;
const FocalPointActionRow = styledComponents.styled(designSystem.Flex)`
  z-index: 1;
  height: 5.2rem;
  position: absolute;
  background-color: rgba(33, 33, 52, 0.4);
  width: 100%;
`;
const FocalPointImageWrapper = styledComponents.styled.div`
  display: inline-block;
  position: relative;
`;
const FocalPointAim = styledComponents.styled.div`
  position: absolute;
  pointer-events: none;
  left: ${({ $focalPoint })=>$focalPoint.x}%;
  top: ${({ $focalPoint })=>$focalPoint.y}%;

  &:before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid ${({ theme })=>theme.colors.primary700};
    border-radius: 50%;
    background-color: ${({ theme })=>theme.colors.primary500};
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;
const FocalPointHalo = styledComponents.styled.div`
  &:before {
    content: '';
    position: absolute;
    width: 50px;
    height: 50px;
    border: 1px solid ${({ theme })=>theme.colors.neutral500};
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

exports.ActionRow = ActionRow;
exports.BadgeOverride = BadgeOverride;
exports.CroppingActionRow = CroppingActionRow;
exports.FocalPointActionRow = FocalPointActionRow;
exports.FocalPointAim = FocalPointAim;
exports.FocalPointHalo = FocalPointHalo;
exports.FocalPointImageWrapper = FocalPointImageWrapper;
exports.RelativeBox = RelativeBox;
exports.UploadProgressWrapper = UploadProgressWrapper;
exports.Wrapper = Wrapper;
//# sourceMappingURL=PreviewComponents.js.map
