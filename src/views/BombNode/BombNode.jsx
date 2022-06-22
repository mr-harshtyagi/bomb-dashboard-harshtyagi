import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import PageHeader from '../../components/PageHeader';
import { Box, Card, CardContent, Typography, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import useBank from '../../hooks/useBank';
import useNodes from '../../hooks/useNodes';
import useMaxPayout from '../../hooks/useMaxPayout';
import useUserDetails from '../../hooks/useUserDetails';
import totalNodes from '../../hooks/useTotalNodes';
import useStatsForPool from '../../hooks/useStatsForPool';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import useNodePrice from '../../hooks/useNodePrice';
import { getDisplayBalance } from '../../utils/formatBalance';
import { Alert } from '@material-ui/lab';
import useDailyDrip from '../../hooks/useDailyDrip';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const BombNode = () => {
  const { bankId } = useParams();

  const bank = useBank(bankId);
  const { account } = useWallet();
  const classes = useStyles();
  const statsOnPool = useStatsForPool(bank);
  const nodes = useNodes(bank?.contract, bank?.sectionInUI, account);
  const nodePrice = useNodePrice(bank.contract, bank.poolId, bank.sectionInUI);
  const total = totalNodes(bank?.contract, bank?.sectionInUI);
  const max = useMaxPayout(bank?.contract, bank?.sectionInUI, account);
  const daily = useDailyDrip(bank?.contract, bank?.sectionInUI, account);
  const userDetails = useUserDetails(bank?.contract, bank?.sectionInUI, account);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);

  const tokenPriceInDollars = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );

  return bank
    ? (
      <>
        <PageHeader icon="🏦" subtitle={''} title={bank?.name} />

        <Box>
          {/* <Alert variant="filled" severity="warning">
            BOMB Nodes are brand new! Contracts were forked from a reputable source, but have not been tested or studied by the BOMB team yet. Use at your own risk.</Alert> */}
          <Grid container justify="center" spacing={2} style={{ marginBottom: '50px', marginTop: '20px' }}>

            <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>

              <Card className={classes.gridItem}>
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Your Nodes | Value</Typography>
                  <Typography>
                    {
                      nodes[0] &&
                      <>
                        <b style={{ color: 'rgb(255, 255, 255)', marginRight: '0px' }}>
                          {nodes[0].toString()}
                        </b> |  <b style={{ color: 'rgb(255, 255, 255)', marginRight: '0px' }}>
                          ${(nodes[0] * (tokenPriceInDollars * getDisplayBalance(nodePrice, bank.depositToken.decimal, 1))).toFixed(0)}

                        </b>

                      </>
                    }
                  </Typography>
                </CardContent>
              </Card>

            </Grid>
            <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
              <Card className={classes.gridItem}>
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Daily | $</Typography>
                  <Typography>{(Number(daily) / 1e18).toFixed(2)} | $ {((Number(daily) / 1e18) * (tokenPriceInDollars)).toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
              <Card className={classes.gridItem}>
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Amount Claimed</Typography>
                  <Typography>{(Number(userDetails.total_claims) / 1e18).toFixed(2)} </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
              <Card className={classes.gridItem}>
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Max Possible Pay</Typography>
                  <Typography>{Number(max) / 1e18} </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
              <Card className={classes.gridItem}>
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>APR | Daily</Typography>
                  <Typography>{bank.closedForStaking ? '0.00' : statsOnPool?.yearlyAPR}% | {bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
              <Card className={classes.gridItem}>
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Total Nodes | TVL</Typography>
                  <Typography>{Number(total[0])} | ${statsOnPool?.TVL ? (Number((Number(statsOnPool?.TVL).toFixed(0)))).toLocaleString('en-US') : '-.--'}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box mt={5}>

          <StyledBank>
            <StyledCardsWrapper>
              <StyledCardWrapper>

                <Harvest bank={bank} />
              </StyledCardWrapper>
              <Spacer />
              <StyledCardWrapper>{<Stake bank={bank} />}</StyledCardWrapper>
            </StyledCardsWrapper>
            <Spacer size="lg" />
            {bank.depositTokenName === 'BOMB-BTCB-LP' ?
              <Card>
                <CardContent >
                  <StyledLink href={'https://pancakeswap.finance/add/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c/'} rel="noopener noreferrer" target="_blank">
                    <span style={{ color: '#fff' }}>
                      Provide liquidity for BOMB-BTCB on PancakeSwap
                    </span>
                  </StyledLink>
                </CardContent>
              </Card>
              : null}
          </StyledBank>
        </Box>


      </>
    )
    : <BankNotFound />
};


const BankNotFound = () => {
  return (
    <Center>
      <PageHeader icon="🏚" title="Not Found" subtitle="You've hit a bank just robbed by unicorns." />
    </Center>
  );
};

const StyledBank = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: ${(props) => props.theme.color.primary.main};
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;


export default BombNode;
