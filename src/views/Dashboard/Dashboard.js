import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import { ArrowUpwardSharp,ArrowDownwardSharp,ShoppingCart } from '@material-ui/icons';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useBombStats from '../../hooks/useBombStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsBTC from '../../hooks/useLpStatsBTC';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usebShareStats from '../../hooks/usebShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
// import { Bomb as bombTesting } from '../../bomb-finance/deployments/deployments.testing.json';
//import { Bomb as bombProd } from '../../bomb-finance/deployments/deployments.mainnet.json';
import { roundAndFormatNumber } from '../../0x';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import DiscordIcon from '../../assets/img/discord.svg';
import DocsIcon from '../../assets/img/github.svg';
import { Box, Button, Card, CardContent, Grid, Paper, TableCell } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';
import { Alert } from '@material-ui/lab';
import { IoCloseOutline } from 'react-icons/io5';
import { BiLoaderAlt } from 'react-icons/bi';
import { makeStyles } from '@material-ui/core/styles';
import useBombFinance from '../../hooks/useBombFinance';
import { Helmet } from 'react-helmet';
import BombImage from '../../assets/img/bomb.png';
import BShareImage from '../../assets/img/bshare-512.png';
import BombBTCBImage from '../../assets/img/bomb-bitcoin-LP.png';
import BShareBNBImage from '../../assets/img/bshare-bnb-LP.png';
import Bbond from '../../assets/img/bbond-512.png';
import RingImage from '../../assets/img/ring.svg';

import HomeImage from '../../assets/img/background.jpg';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'Investment Dashboard';

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      // marginTop: '10px'
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const bombFtmLpStats = useLpStatsBTC('BOMB-BTCB-LP');
  const bShareFtmLpStats = useLpStats('BSHARE-BNB-LP');
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const bombFinance = useBombFinance();

  const buyBombAddress = //'https://app.1inch.io/#/56/swap/BTCB/BOMB';
    //  'https://pancakeswap.finance/swap?inputCurrency=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&outputCurrency=' +
    'https://app.bogged.finance/bsc/swap?tokenIn=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&tokenOut=0x522348779DCb2911539e76A1042aA922F9C47Ee3';
  //https://pancakeswap.finance/swap?outputCurrency=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBShareAddress = //'https://app.1inch.io/#/56/swap/BNB/BSHARE';
    'https://app.bogged.finance/bsc/swap?tokenIn=BNB&tokenOut=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBusmAddress =
    'https://app.bogged.finance/bsc/swap?tokenIn=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&tokenOut=0x6216B17f696B14701E17BCB24Ec14430261Be94A';
  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const bshareLPStats = useMemo(() => (bShareFtmLpStats ? bShareFtmLpStats : null), [bShareFtmLpStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const bombLpZap = useZap({ depositTokenName: 'BOMB-BTCB-LP' });
  const bshareLpZap = useZap({ depositTokenName: 'BSHARE-BNB-LP' });

  const [onPresentBombZap, onDissmissBombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBombZap();
      }}
      tokenName={'BOMB-BTCB-LP'}
    />,
  );

  const [onPresentBshareZap, onDissmissBshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBshareZap();
      }}
      tokenName={'BSHARE-BNB-LP'}
    />,
  );

  const [modal, setModal] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const openModal = () => {
    setModal(!modal);
  };

  const spinner = () => {
    setVideoLoading(!videoLoading);
  };
 
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />
      <Grid container spacing={3} style={{ padding: '20px 8% 40px 8%' }}>
        {/* Bomb Finance Summary */}
        <Grid xs={12} style={{ marginBottom: '12px' }}>
          <Paper style={{ background: 'rgba(32, 37, 67, 0.5)', height: '350px', borderRadius: '5px' }}>
            <div style={{ textAlign: 'center', paddingTop: '5px' }}>
              <p>Bomb Finance Summary</p>
              <hr style={{ border: '0.5px solid rgba(195, 197, 203, 0.75)', width: '80%' }} />
            </div>
            <Grid container spacing={3} style={{ textAlign: 'center' }}>
              {/* Supply & Price Table */}
              <Grid item xs={5} style={{ textAlign: 'center', paddingLeft: '10px' }}>
                <p style={{ fontSize: '0.7rem' }}>
                  <span style={{ marginLeft: '15px' }}>Current Supply</span>
                  <span style={{ marginLeft: '20px' }}>Total Supply</span>
                  <span style={{ marginLeft: '60px' }}>Price</span>
                </p>
                <hr style={{ border: '0.5px solid rgba(195, 197, 203, 0.75)', marginLeft: '100px' }} />
                <Grid container style={{ textAlign: 'center' }}>
                  <Grid item xs={3}>
                    <img
                      alt="b share image"
                      style={{ width: '20px', float: 'left', marginRight: '3px', marginLeft: '10px' }}
                      src={BombImage}
                    />
                    $ BOMB
                  </Grid>
                  <Grid item xs={2}>
                    8.66M
                  </Grid>
                  <Grid item xs={2}>
                    60.9k
                  </Grid>
                  <Grid item xs={5}>
                    <p style={{ padding: '0', margin: '0' }}>
                      $ 0.24
                      <img
                        alt="b share image"
                        style={{ width: '30px', float: 'right', paddingTop: '10px' }}
                        src={MetamaskFox}
                      />
                    </p>
                    <p style={{ padding: '0', marfin: '0' }}>1.05 BTCB</p>
                  </Grid>
                </Grid>
                <hr style={{ border: '0.5px solid rgba(195, 197, 203, 0.75)', marginLeft: '50px' }} />
                <Grid container style={{ textAlign: 'center' }}>
                  <Grid item xs={3}>
                    <img
                      alt="b share image"
                      style={{ width: '20px', float: 'left', marginRight: '3px', marginLeft: '10px' }}
                      src={BShareImage}
                    />
                    $ BSHARE
                  </Grid>
                  <Grid item xs={2}>
                    8.66M
                  </Grid>
                  <Grid item xs={2}>
                    60.9k
                  </Grid>
                  <Grid item xs={5}>
                    <p style={{ padding: '0', margin: '0' }}>
                      $ 0.24
                      <img
                        alt="b share image"
                        style={{ width: '30px', float: 'right', paddingTop: '10px' }}
                        src={MetamaskFox}
                      />
                    </p>
                    <p style={{ padding: '0', marfin: '0' }}>1.05 BTCB</p>
                  </Grid>
                </Grid>
                <hr style={{ border: '0.5px solid rgba(195, 197, 203, 0.75)', marginLeft: '50px' }} />
                <Grid container style={{ textAlign: 'center' }}>
                  <Grid item xs={3}>
                    <img
                      alt="b share image"
                      style={{ width: '20px', float: 'left', marginRight: '3px', marginLeft: '10px' }}
                      src={Bbond}
                    />
                    $ BBOND
                  </Grid>
                  <Grid item xs={2}>
                    8.66M
                  </Grid>
                  <Grid item xs={2}>
                    60.9k
                  </Grid>
                  <Grid item xs={5}>
                    <p style={{ padding: '0', margin: '0' }}>
                      $ 0.24
                      <img
                        alt="b share image"
                        style={{ width: '30px', float: 'right', paddingTop: '10px' }}
                        src={MetamaskFox}
                      />
                    </p>
                    <p style={{ padding: '0', marfin: '0' }}>1.05 BTCB</p>
                  </Grid>
                </Grid>
              </Grid>
              {/* Epoch */}
              <Grid item xs={2} style={{ textAlign: 'center' }}>
                Current Epoch
                <h3 style={{ fontSize: '2rem', color: 'white' }}>258</h3>
                <hr style={{ border: '0.5px solid rgba(195, 197, 203, 0.75)', width: '80%' }} />
                <h3 style={{ fontSize: '2rem', color: 'white' }}>03:38:36</h3>
                <p>Next Epoch in</p>
                <hr style={{ border: '0.5px solid rgba(195, 197, 203, 0.75)', width: '70%' }} />
                <p>
                  <span style={{ fontSize: '0.9rem' }}>Live TWAP :</span>{' '}
                  <span style={{ color: ' #00E8A2' }}>1.17</span>
                </p>
                <p>
                  <span style={{ fontSize: '0.9rem' }}>TVL :</span>{' '}
                  <span style={{ color: ' #00E8A2' }}>$ 5,200,129</span>
                </p>
                <p>
                  <span style={{ fontSize: '0.9rem' }}>Last Epoch TWAP :</span>
                  <span style={{ color: ' #00E8A2' }}>1.22</span>
                </p>
              </Grid>
              {/* Percentages */}
              <Grid item xs={5} style={{ textAlign: 'left', paddingLeft: '40px' }}>
                <Box p={2} style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                  <img alt="ring" style={{ width: '150px',position:"absolute",marginRight:"80px" }} src={RingImage} />{' '}
                  <div
                    style={{
                      height: '100px',
                      width: '100px',
                      backgroundColor: '#373747',
                      borderRadius: '50%',
                      marginRight: '80px',
                      marginTop:"25px"
                    }}
                  >
                    <h3 style={{ color: 'white', marginTop: '35px' }}>$ 10,451</h3>
                    <h5 style={{ color: '#5DFDB0', margin: '2px' }}>+22 %</h5>
                  </div>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <p style={{ fontSize: '0.9rem' }}>
                      <img alt="bomb image" style={{ width: '15px' }} src={BombImage} /> Bomb: <strong>17%</strong>
                    </p>
                    <p style={{ fontSize: '0.9rem' }}>
                      <img alt="bomb image" style={{ width: '15px' }} src={BShareImage} /> BShare: <strong>17%</strong>
                    </p>
                    <p style={{ fontSize: '0.9rem' }}>
                      <img alt="bomb image" style={{ width: '15px' }} src={Bbond} /> BBond: <strong>17%</strong>
                    </p>
                  </Grid>
                  <Grid item xs={6}>
                    <p style={{ fontSize: '0.9rem' }}>
                      <img alt="bomb image" style={{ width: '15px' }} src={BombBTCBImage} /> Bomb-BTCB:{' '}
                      <strong>17%</strong>
                    </p>
                    <p style={{ fontSize: '0.9rem' }}>
                      <img alt="bomb image" style={{ width: '15px' }} src={BShareBNBImage} /> BShare-BNB:{' '}
                      <strong>17%</strong>
                    </p>
                    <p style={{ fontSize: '0.9rem' }}>
                      <div
                        style={{
                          width: '15px',
                          height: '15px',
                          borderRadius: '50%',
                          backgroundColor: '#373747',
                          display: 'inline-block',
                        }}
                      ></div>{' '}
                      Others: <strong>17%</strong>
                    </p>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* BoardRoom */}
        <Grid item xs={12} sm={8} style={{ marginBottom: '20px' }}>
          <Box p={2} style={{ textAlign: 'center' }}>
            <a
              href="/strategy"
              style={{ float: 'right', color: '#9EE6FF', textDecoration: 'underline', marginBottom: '10px' }}
            >
              Read Investement Strategy
            </a>
            <Button
              style={{
                color: 'white',
                background:
                  'radial-gradient(59345.13% 4094144349.28% at 39511.5% -2722397851.45%, rgba(0, 245, 171, 0.5) 0%, rgba(0, 173, 232, 0.5) 100%)',
                width: '100%',
                marginBottom: '15px',
              }}
            >
              <strong>Invest Now</strong>
            </Button>
            <Button
              style={{
                color: 'black',
                background: 'rgba(255, 255, 255, 0.5)',
                width: '45%',
                marginRight: '2%',
              }}
            >
              <img alt="discord icon" style={{ width: '20px', marginRight: '5px' }} src={DiscordIcon} />
              <strong>Chat on Discord</strong>
            </Button>
            <Button style={{ color: 'black', background: 'rgba(255, 255, 255, 0.5)', width: '45%' }}>
              <img alt="docs icon" style={{ width: '20px', marginRight: '5px' }} src={DocsIcon} />
              <strong>Read Docs</strong>
            </Button>
          </Box>
          <Paper style={{ background: 'rgba(32, 37, 67, 0.5)', borderRadius: '5px' }}>
            <Box p={4} style={{ textAlign: 'left' }}>
              <img
                alt="b share image"
                style={{ width: '50px', float: 'left', marginRight: '10px' }}
                src={BShareImage}
              />

              <h3 style={{ color: 'white' }}>
                BoardRoom
                <span
                  style={{
                    color: 'white',
                    fontSize: '0.7rem',
                    padding: '3px',
                    borderRadius: '3px',
                    marginLeft: '20px',
                    verticalAlign: 'center',
                    backgroundColor: 'rgba(0, 232, 162, 0.5)',
                  }}
                >
                  Recommended
                </span>
              </h3>
              <p>
                Stake BSHARE and earn BOMB every epoch
                <span style={{ float: 'right' }}>
                  TVL: <strong>${'1,008,430'}</strong>
                </span>
              </p>
              <hr style={{ border: '0.5px solid rgba(195, 197, 203, 0.75)' }} />
              <p style={{ float: 'right' }}>
                Total Staked:
                <span>
                  <img alt="b share image" style={{ width: '13px', margin: '0 5px' }} src={BShareImage} />
                  <strong>{'7232'}</strong>
                </span>
              </p>
            </Box>
            <Grid container spacing={4} style={{ textAlign: 'center' }}>
              <Grid item xs={3} style={{ padding: '0' }}>
                Daily returns:
                <h2 style={{ color: 'white', marginTop: '20px', fontSize: '2rem' }}>2%</h2>
              </Grid>
              <Grid item xs={2} style={{ padding: '0', textAlign: 'left' }}>
                Your Stake:
                <p>
                  <img alt="b share image" style={{ width: '20px' }} src={BShareImage} />
                  6.0000
                </p>
                <p>≈ $1171.62</p>
              </Grid>
              <Grid item xs={2} style={{ padding: '0', textAlign: 'left' }}>
                Earned:
                <p>
                  <img alt="b share image" style={{ width: '20px' }} src={BombImage} />
                  1660.4413
                </p>
                <p>≈ $1171.62</p>
              </Grid>
              <Grid item xs={5} style={{ padding: '0' }}>
                <Box style={{ textAlign: 'center', padding: '10px' }}>
                  <Button style={{ width: '45%', border: 'solid 2px', borderRadius: '20px', marginRight: '10px' }}>
                    Deposit <ArrowUpwardSharp />
                  </Button>
                  <Button style={{ width: '45%', border: 'solid 2px', borderRadius: '20px', marginRight: '10px' }}>
                    Withdraw <ArrowDownwardSharp />
                  </Button>
                  <Button
                    style={{
                      width: '90%',
                      border: 'solid 2px',
                      borderRadius: '20px',
                      marginTop: '10px',
                      marginRight: '10px',
                    }}
                  >
                    Claim Rewards
                    <img alt="b share image" style={{ width: '15px', marginLeft: '5px' }} src={BShareImage} />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Latest News */}
        <Grid item xs={12} sm={4} style={{ marginBottom: '20px' }}>
          <Paper style={{ background: 'rgba(32, 37, 67, 0.5)', height: '420px', borderRadius: '5px' }}>
            <Box p={4} style={{ textAlign: 'left' }}>
              <h3 style={{ color: 'white' }}>Latest News</h3>
            </Box>
          </Paper>
        </Grid>

        {/* Bomb Farms */}
        <Grid xs={12} style={{ marginBottom: '40px' }}>
          <Paper style={{ background: 'rgba(32, 37, 67, 0.5)', borderRadius: '5px' }}>
            {/* BOMB-BTCB */}
            <Box style={{ textAlign: 'left', padding: '10px 20px 0px 20px' }}>
              <h3 style={{ color: 'white' }}>
                Bomb Farms
                <span style={{ float: 'right' }}>
                  <Button
                    style={{
                      border: 'solid 2px',
                      borderRadius: '20px',
                    }}
                  >
                    Claim All
                    <img alt="b share image" style={{ width: '15px', marginLeft: '5px' }} src={BShareImage} />
                  </Button>
                </span>
              </h3>
              <p>Stake your LP tokens in our farms to start earning $BSHARE</p>
            </Box>
            <Box p={4} style={{ textAlign: 'left', paddingTop: '10px' }}>
              <img
                alt="b share image"
                style={{ width: '60px', float: 'left', marginRight: '10px' }}
                src={BombBTCBImage}
              />
              <h3 style={{ color: 'white', marginTop: '20px' }}>
                BOMB-BTCB
                <span
                  style={{
                    color: 'white',
                    fontSize: '0.7rem',
                    padding: '3px',
                    borderRadius: '3px',
                    marginLeft: '20px',
                    verticalAlign: 'center',
                    backgroundColor: 'rgba(0, 232, 162, 0.5)',
                  }}
                >
                  Recommended
                </span>
                <span style={{ float: 'right' }}>
                  TVL : <strong>${'1,008,430'}</strong>
                </span>
              </h3>
              <hr style={{ border: '0.5px solid rgba(195, 197, 203, 0.75)' }} />
            </Box>
            <Grid container spacing={4} style={{ textAlign: 'center' }}>
              <Grid item xs={2} style={{ padding: '0' }}>
                Daily returns:
                <h2 style={{ color: 'white', marginTop: '20px', fontSize: '2rem' }}>2%</h2>
              </Grid>
              <Grid item xs={2} style={{ padding: '0', textAlign: 'left' }}>
                Your Stake:
                <p>
                  <img alt="b share image" style={{ width: '20px' }} src={BShareImage} />
                  6.0000
                </p>
                <p>≈ $1171.62</p>
              </Grid>
              <Grid item xs={2} style={{ padding: '0', textAlign: 'left' }}>
                Earned:
                <p>
                  <img alt="b share image" style={{ width: '20px' }} src={BombImage} />
                  1660.4413
                </p>
                <p>≈ $1171.62</p>
              </Grid>
              <Grid item xs={6} style={{ padding: '0' }}>
                <Box style={{ textAlign: 'center', marginTop: '60px' }}>
                  <Button style={{ width: '25%', border: 'solid 2px', borderRadius: '20px', marginRight: '10px' }}>
                    Deposit <ArrowUpwardSharp />
                  </Button>
                  <Button style={{ width: '25%', border: 'solid 2px', borderRadius: '20px', marginRight: '10px' }}>
                    Withdraw <ArrowDownwardSharp />
                  </Button>
                  <Button
                    style={{
                      width: '30%',
                      border: 'solid 2px',
                      borderRadius: '20px',
                    }}
                  >
                    Claim Rewards
                    <img alt="b share image" style={{ width: '15px', marginLeft: '5px' }} src={BShareImage} />
                  </Button>
                </Box>
              </Grid>
            </Grid>
            {/* BSHARE-BNB */}
            <Box p={4} style={{ textAlign: 'left' }}>
              <img
                alt="b share image"
                style={{ width: '60px', float: 'left', marginRight: '10px' }}
                src={BShareBNBImage}
              />
              <h3 style={{ color: 'white', marginTop: '20px' }}>
                BSHARE-BNB
                <span
                  style={{
                    color: 'white',
                    fontSize: '0.7rem',
                    padding: '3px',
                    borderRadius: '3px',
                    marginLeft: '20px',
                    verticalAlign: 'center',
                    backgroundColor: 'rgba(0, 232, 162, 0.5)',
                  }}
                >
                  Recommended
                </span>
                <span style={{ float: 'right' }}>
                  TVL : <strong>${'1,008,430'}</strong>
                </span>
              </h3>

              <hr style={{ border: '0.5px solid rgba(195, 197, 203, 0.75)' }} />
            </Box>
            <Grid container spacing={4} style={{ textAlign: 'center' }}>
              <Grid item xs={2} style={{ padding: '0' }}>
                Daily returns:
                <h2 style={{ color: 'white', marginTop: '20px', fontSize: '2rem' }}>2%</h2>
              </Grid>
              <Grid item xs={2} style={{ padding: '0', textAlign: 'left' }}>
                Your Stake:
                <p>
                  <img alt="b share image" style={{ width: '20px' }} src={BShareImage} />
                  6.0000
                </p>
                <p>≈ $1171.62</p>
              </Grid>
              <Grid item xs={2} style={{ padding: '0', textAlign: 'left' }}>
                Earned:
                <p>
                  <img alt="b share image" style={{ width: '20px' }} src={BombImage} />
                  1660.4413
                </p>
                <p>≈ $1171.62</p>
              </Grid>
              <Grid item xs={6} style={{ padding: '0' }}>
                <Box style={{ textAlign: 'center', marginTop: '60px', paddingBottom: '30px' }}>
                  <Button style={{ width: '25%', border: 'solid 2px', borderRadius: '20px', marginRight: '10px' }}>
                    Deposit <ArrowUpwardSharp />
                  </Button>
                  <Button style={{ width: '25%', border: 'solid 2px', borderRadius: '20px', marginRight: '10px' }}>
                    Withdraw <ArrowDownwardSharp />
                  </Button>
                  <Button
                    style={{
                      width: '30%',
                      border: 'solid 2px',
                      borderRadius: '20px',
                    }}
                  >
                    Claim Rewards
                    <img alt="b share image" style={{ width: '15px', marginLeft: '5px' }} src={BShareImage} />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* Bonds */}
        <Grid xs={12}>
          <Paper style={{ background: 'rgba(32, 37, 67, 0.5)', borderRadius: '5px' }}>
            <Box p={4} style={{ textAlign: 'left' }}>
              <img alt="b share image" style={{ width: '60px', float: 'left', marginRight: '10px' }} src={Bbond} />
              <h3 style={{ color: 'white' }}>Bonds</h3>
              <p>BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1</p>
            </Box>
            <Grid container spacing={3} style={{ textAlign: 'center' }}>
              <Grid item xs={3} style={{ padding: '0' }}>
                Current Price :(Bomb)^2
                <h3 style={{ color: 'white', marginTop: '10px' }}>BBond = 6.2872 BTCB</h3>
              </Grid>
              <Grid item xs={3} style={{ padding: '0', textAlign: 'center' }}>
                Available to redeem:
                <h3 style={{ color: 'white', fontSize: '2rem' }}>
                  <img alt="b share image" style={{ width: '40px' }} src={Bbond} />
                  456
                </h3>
              </Grid>
              <Grid item xs={6} style={{ paddingRight: '20px' }}>
                <Box style={{ padding: '10px', textAlign: 'left' }}>
                  <p style={{ color: 'white' }}>
                    Purchase BBond
                    <span style={{ float: 'right' }}>
                      <Button variant="" style={{ border: 'solid 2px', borderRadius: '20px', marginRight: '10px' }}>
                        Purchase <ShoppingCart />
                      </Button>
                    </span>
                  </p>
                  <p style={{ fontSize: '0.9rem' }}>Bomb is over peg</p>
                  <hr style={{ border: '0.5px solid rgba(195, 197, 203, 0.75)' }} />

                  <p style={{ color: 'white' }}>
                    Redeem Bond
                    <span style={{ float: 'right' }}>
                      <Button variant="" style={{ border: 'solid 2px', borderRadius: '20px', marginRight: '10px' }}>
                        Redeem <ArrowDownwardSharp />
                      </Button>
                    </span>
                  </p>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
