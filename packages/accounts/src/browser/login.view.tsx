import * as React from 'react';
import { useLocation } from 'react-router';
import { parse, stringify } from 'querystring';
import { ConfigUtil } from '@malagu/core';
import { View, Redirect } from '@malagu/react';
import { LocaleMenu, Icon } from '@malagu/grommet';
import { useIntl } from 'react-intl';
import { Box, Button, Heading, ResponsiveContext, Nav } from 'grommet';
import styled from 'styled-components';
import { Github } from 'grommet-icons';
const { useContext } = React;

const StyledWraper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fafafa;
`;

interface ContainerProps {
    size: string;
};

const StyledContainer = styled.div<ContainerProps>`
    width: ${props => props.size === 'small' ? '100%' : '340px'};
    height: ${props => props.size === 'small' ? '100%' : '500px'};
    position: absolute;
    top: ${props => props.size === 'small' ? '0' : 'calc(50% - 250px)'};
    left: ${props => props.size === 'small' ? '0' : 'calc(50% - 170px)'};
    text-align: center;
    background-color: #ffffff;
    box-shadow: ${props => props.size === 'small' ? 'none' : '0px 0px 5px #e9e9e9'};
    border-radius: ${props => props.size === 'small' ? '0' : '8px'};
`;

export function Login() {
    const location = useLocation();
    const size = useContext(ResponsiveContext);
    const intl = useIntl();
    const targetUrlParameter = ConfigUtil.get<string>('malagu.security.targetUrlParameter');
    const redirect = parse(location.search && location.search.substring(1))[targetUrlParameter];
    const queryStr = redirect ? `?${stringify({ [targetUrlParameter]: redirect})}` : '';
    return (
    <StyledWraper style={size === 'small' ? { top: 0, bottom: 0, right: 0, left: 0 } : undefined }>
        <StyledContainer size={size}>
            <Box direction="column" pad="large" align="center" background="brand" round={ size === 'small' ? undefined : { corner: 'top', size: '8px' } }>
                <Button plain
                    href={ConfigUtil.get('cellbang.accounts.home.url')}
                    icon={<Icon size="large" color="white" icon={ConfigUtil.get('cellbang.accounts.logo.icon')}></Icon>}>
                </Button>
                <Heading level="4" color="white">{intl.formatMessage({ id: 'cellbang.accounts.logo.label' })}</Heading>
            </Box>
            <Box direction="column" align="center" animation="slideDown">
                <Heading level="6">{intl.formatMessage({ id: 'cellbang.accounts.quick.login.label' })}</Heading>
                <Nav>
                    <Button hoverIndicator icon={<Github size="large"></Github>} href={`/oauth2/authorization/github${queryStr}`}></Button>
                </Nav>
            </Box>
            <Box direction="column" fill="horizontal" style={ { position: 'absolute', bottom: 0 } } align="center">
                <LocaleMenu items={[]} size="small"/>
            </Box>
        </StyledContainer>
    </StyledWraper>);

}
@View({ path: '/login', component: Login })
@Redirect('/login')
export default class {}
