import { Button, Card, CardContent, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import Page from '../../components/Page';
import BombNode from '../BombNode';
import BombCard from './BombCard';
import LPCard from './LPCard';
import { Helmet } from 'react-helmet';
import { createGlobalStyle } from 'styled-components';
import HomeImage from '../../assets/img/background.jpg';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Moralis from 'moralis/node';
import { lotteries, moralisConfiguration } from '../../config';
import { getLeaderboardTotal } from './util/getLeaderboardTotal';
import { useWallet } from 'use-wallet';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;

const TITLE = 'bomb.money | Nodes';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const BombNodes = () => {
  const classes = useStyles();
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [userEntries, setUserEntries] = useState(null);

  const from = moment('2022-06-19 6:00 +0000');
  const to = moment('2022-06-26 6:00 +0000');

  useEffect(() => {
    fetchLeaderboardData();
  }, [account]);

  const fetchLeaderboardData = async () => {
    // const params =  { };
    const Moralis = require('moralis/node');
    await Moralis.start({
      serverUrl: moralisConfiguration.serverUrl,
      appId: moralisConfiguration.appId,
    });

    const leaderboardData = await getLeaderboardTotal(lotteries, from, to);
    setLeaderboardData(leaderboardData);
    if (account) {
      const userEntries = leaderboardData.filter(data => data.wallet.toLowerCase() === account.toLowerCase());
      setUserEntries(userEntries.length > 0 ? userEntries : [{ 'entries': 0 }]);
    }
  };

  return (
    <Page>
      <BackgroundImage />
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <Switch>
        <Route exact path={path}>
          <h1 style={{ fontSize: '80px', textAlign: 'center' }}>NODES</h1>
          <Grid container spacing={3} style={{ marginTop: '20px' }}>
            <BombCard />
            <LPCard />
          </Grid>
          <p>&nbsp;</p>
          <h1 style={{ fontSize: '80px', textAlign: 'center' }}>LOTTERY</h1>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
              <Card className={classes.gridItem}>
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Next Draw</Typography>
                  <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to.toDate()} description="Next Draw" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
              <Card className={classes.gridItem}>
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Your entries</Typography>
                  { userEntries && userEntries.length > 0 ? (
                    <>{userEntries[0].entries}</>
                  ) : '-' }
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
              <Card className={classes.gridItem}>
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Current leader</Typography>
                  { leaderboardData && leaderboardData.length > 0 ? (
                    <>{leaderboardData[0].entries}</>
                  ) : '-' }
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} md={2} lg={2}>
              <p style={{lineHeight: '5px'}}>&nbsp;</p>
              <Button className="shinyButtonSecondary" style={{ 'width': '100%' }} component={Link}
                      to={'/nodes-lottery'}>
                View leaderboard
              </Button>
            </Grid>
          </Grid>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} md={7} lg={7}>
              <p style={{lineHeight: '5px', marginTop: 0, marginBottom: '7px'}}>&nbsp;</p>
              <Card style={{padding: '10px'}}>
                <p style={{ color: '#fff' }}>
                  Create nodes and enter into our weekly lottery for the chance to win X BSHARES.
                  <ol style={{'paddingLeft': '20px'}}>
                    <li>Draws occur weekly, every Sunday at 6PM UTC.</li>
                    <li>Each BOMB Node created before the draw automatically earns you 1 entry.</li>
                    <li>Each LP Node created before the draw automatically earns you 10 entries.</li>
                    <li>The wallet with the most entries at the time of the draw automatically wins the first spot.</li>
                    <li>A second winner is randomly selected based on their entries.</li>
                  </ol>
                </p>
              </Card>
            </Grid>
          </Grid>
        </Route>
        <Route path={`${path}/:bankId`}>
          <BombNode />
        </Route>
      </Switch>
    </Page>
  );
};

export default BombNodes;
