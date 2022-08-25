import { alpha, Box, Button, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { RootState } from '../../app/store';
import { COOKIES_ACCEPTED, COOKIES_REJECTED } from '../../constants/events';
import { useTypedSelector } from '../../hooks/store';
import IllustrationCookieCat from '../../public/illustration_cookie_cat.svg';
import logEvent, { getEventUserData } from '../../utils/logEvent';
import Link from '../common/Link';

const Consent = (props: {}) => {
  const theme = useTheme();
  const { user, partnerAccesses, partnerAdmin } = useTypedSelector((state: RootState) => state);
  const eventUserData = getEventUserData({ user, partnerAccesses, partnerAdmin });
  const tS = useTranslations('Shared');

  const consentBoxStyle: React.CSSProperties = {
    backgroundColor: 'secondary.light',
    maxWidth: theme.spacing(50),
    maxHeight: theme.spacing(35),
    position: 'fixed',
    left: theme.spacing(1),
    bottom: theme.spacing(1),
    borderRadius: theme.spacing(2),
    boxShadow: `${alpha(theme.palette.common.black, 0.2)} 0px ${theme.spacing(1)} ${theme.spacing(
      4,
    )} 0px`,
    textAlign: 'center',
    lineHeight: 1.5,
    marginRight: theme.spacing(1),
    padding: `${theme.spacing(1)} ${theme.spacing(3)} ${theme.spacing(1.5)} ${theme.spacing(3)}`,
    fontSize: theme.typography.body2.fontSize,
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.body1.fontSize,
      padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
      left: theme.spacing(2),
      bottom: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
  };
  const acceptButtonStyle = {
    backgroundColor: 'secondary.main',
    marginBottom: theme.spacing(1),
  };
  const declineButtonStyle = {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: 'normal',
    margin: 'auto',
    display: 'block',
    color: theme.palette.common.black,
  };

  const handleDecline = () => {
    logEvent(COOKIES_REJECTED, eventUserData);
    (window as any).gtag('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
    });
  };
  const handleAccept = () => {
    logEvent(COOKIES_ACCEPTED, eventUserData);
    (window as any).gtag('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'granted',
    });
  };

  return (
    <Box sx={consentBoxStyle}>
      <CookieConsent
        disableStyles={true}
        buttonText={tS('cookieConsent.acceptLabel')}
        declineButtonText={tS('cookieConsent.declineLabel')}
        cookieName="analyticsConsent"
        location="none"
        expires={365}
        onAccept={handleAccept}
        onDecline={handleDecline}
        enableDeclineButton
        ButtonComponent={Button}
        customButtonProps={{
          size: 'medium',
          variant: 'contained',
          display: 'block',
          qaId: 'cookieConsentAcceptButton',
          sx: acceptButtonStyle,
        }}
        customDeclineButtonProps={{
          size: 'small',
          variant: 'text',
          qaId: 'cookieConsentDeclineButton',
          sx: declineButtonStyle,
        }}
        ariaAcceptLabel={tS('cookieConsent.acceptLabel')}
        ariaDeclineLabel={tS('cookieConsent.declineLabel')}
        flipButtons={true}
      >
        <Box width={[60, 70]} margin="auto" marginBottom={2}>
          <Image alt={tS('alt.cookieCat')} src={IllustrationCookieCat} layout="responsive" />
        </Box>
        <Box marginBottom={2}>
          {tS('cookieConsent.cookieConsentExplainer')}
          <Link href="https://chayn.notion.site/Cookie-Policy-e478b184ea6a4002ba660d052f332c5a">
            {tS('cookieConsent.cookieConsentPolicy')}
          </Link>
        </Box>
      </CookieConsent>
    </Box>
  );
};

export default Consent;
