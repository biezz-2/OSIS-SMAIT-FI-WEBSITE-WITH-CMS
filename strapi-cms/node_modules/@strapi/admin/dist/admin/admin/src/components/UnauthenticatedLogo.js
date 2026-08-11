'use strict';

var jsxRuntime = require('react/jsx-runtime');
var styledComponents = require('styled-components');
var Configuration = require('../features/Configuration.js');

const Img = styledComponents.styled.img`
  height: 7.2rem;
`;
const Logo = ()=>{
    const { logos: { auth } } = Configuration.useConfiguration('UnauthenticatedLogo');
    return /*#__PURE__*/ jsxRuntime.jsx(Img, {
        src: auth?.custom?.url || auth.default,
        "aria-hidden": true,
        alt: ""
    });
};

exports.Logo = Logo;
//# sourceMappingURL=UnauthenticatedLogo.js.map
