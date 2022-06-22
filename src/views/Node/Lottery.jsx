import { Box, Card, CardContent, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import Page from '../../components/Page';
import { Helmet } from 'react-helmet';
import { createGlobalStyle } from 'styled-components';
import HomeImage from '../../assets/img/background.jpg';
import { lotteries, moralisConfiguration } from '../../config';
import moment from 'moment/moment';
import { getLeaderboardTotal } from './util/getLeaderboardTotal';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;

const TITLE = 'bomb.money | Nodes Lottery';


const Lottery = () => {
  const { path } = useRouteMatch();
  const [leaderboardData, setLeaderboardData] = useState(null);

  const from = moment('2022-06-19 6:00 +0000');
  const to = moment('2022-06-26 6:00 +0000');

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    // const params =  { };
    const Moralis = require('moralis/node');
    await Moralis.start({
      serverUrl: moralisConfiguration.serverUrl,
      appId: moralisConfiguration.appId,
    });

    setLeaderboardData(await getLeaderboardTotal(lotteries, from, to));
  };

  return (
    <Page>
      <BackgroundImage />
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <h1 style={{ fontSize: '80px', textAlign: 'center' }}>LOTTERY</h1>
      <h2 style={{ textAlign: 'center' }}>Leaderboards</h2>
      <p style={{'textAlign': 'center', 'color': '#fff'}}>
        The following leaderboard is based on the number of new nodes created within the period
      </p>
      <p style={{'textAlign': 'center', 'color': '#fff', 'fontWeight': 'bold' }}>
        { from.format('DD-MM-YYYY') } to { to.format('DD-MM-YYYY') }
      </p>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {leaderboardData && (
          <Grid item xs={12} sm={12} md={12}>
            <Card variant="outlined">
              <CardContent>
                <Box style={{ position: 'relative' }}>
                  <Typography variant="h5" component="h2" style={{'textAlign': 'center'}}>
                    Leaderboard
                  </Typography>
                  <table style={{'width': '100%'}}>
                    <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th style={{ textAlign: 'left' }}>Wallet</th>
                      <th>BOMB Node Entries</th>
                      <th>BOMB-BTCB-LP Node Entries</th>
                      <th>Total Entries</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leaderboardData.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}.</td>
                        <td>{'0x...' + item.wallet.slice(-8)}</td>
                        <td style={{ textAlign: 'center' }}>{item.entries0}</td>
                        <td style={{ textAlign: 'center' }}>{item.entries1}</td>
                        <td style={{ textAlign: 'center' }}>{item.entries}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Page>
  );
};

export default Lottery;
