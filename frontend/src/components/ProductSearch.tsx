import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { Box, Card, CardContent, makeStyles, TextField, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';


const useStyles = makeStyles({
    field: {
      marginTop: 20,
      marginBottom: 20,
      marginLeft: 20,
      marginRight: 20,
      display: 'block'
    },
    box: {
      margin: 10
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    intro: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    alert: {
      marginTop: 20,
      margin: 'auto',
      width: '50%',
      border: '3px solid green',
      padding: '10px'
    },
    root: {
        marginTop: 20,
        margin: 'auto',
        width: '50%',
        padding: '10px',
        border: '3px solid #2874a6',
        backgroundColor: '#d6eaf8'

    },
    pos: {
        marginBottom: 12,
    }
  })

const ProductSearch = (props: { getProduct: any}) => {

    const classes = useStyles();

    const [upc, setUpc] = useState('');
    const [productName, setProductName] = useState(null);
    const [manufacturer, setManufacturer] = useState(null);
    const [statusMsg, setStatusMsg] = useState('');
    const [score, setScore] = useState('');
    const [productionDate, setProductionDate] = useState('01/01/2000');
    const [severity, setSeverity] = useState('');
    const [upcError, setUpcError] = useState(false);
    const [dateError, setDateError] = useState(false);


    const handleDateChange = (date: Date | null) => {
        if(date) {
            setProductionDate(JSON.stringify(date));
        }
      };

    async function search(e: any) {
        console.log("upc is " + upc);
        e.preventDefault();
        setDateError(false);
        setUpcError(false);
        if(upc == '') {
            setUpcError(true);
        }
        if(upc && productionDate) {

            const {status, product} = await props.getProduct(upc);
            if(product) {
                setProductName(product.name);
                setManufacturer(product.manufacturer);
                getScore();
            } else {
                setSeverity(`error`);
                setStatusMsg(status);
            }
        } 
    }

    return (
        <div className='product-search'>

            <Typography 
                paragraph
                color="textSecondary"
            >
              Are you a consumer interested in the path your food has taken to get to where it is? Using our product 
              search tool, you are able to see the entire history of the food product you're looking at from start to
              finish. Just enter the UPC as well as the prodution date listed on the product.
            </Typography>
            <Box className={classes.container}>
                <Box className={classes.box}>
                    <TextField
                        placeholder="284756193816"
                        id="outlined-basic" 
                        label="UPC" 
                        variant="outlined"
                        value={upc}
                        onChange={e => setUpc(e.target.value)}
                    />
                </Box>
                <Box>
                    <TextField 
                        type="date"
                        id="outlined-basic" 
                        // label="Production Date" 
                        variant="outlined"
                        value={productionDate}
                        onChange={e => setProductionDate(e.target.value)}
                    /> 
                </Box>
                <Box className={classes.box}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        type="submit"
                        onClick={search}
                    >
                        Search
                    </Button>
                </Box>
            </Box>
                <div>
                    {(severity == "success" || severity == "error" || severity == "warning") &&
                        <Alert severity={severity}>{statusMsg}</Alert>
                    }
                    { severity == "success" &&
                        <Card className={classes.root} raised variant="outlined">
                            <CardContent>
                                <Typography variant="h4">
                                    {productName}
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    {manufacturer}
                                    <br/>
                                </Typography>
                                <Typography variant="body1">
                                    Score: {score}
                                </Typography>
                            </CardContent>
                        </Card>
                    }
                </div>
        </div>
    )




    async function getScore() {
        const scoreRes = await fetch(`/api/score/${upc}/${productionDate}`);
        const {score, error} = await scoreRes.json();
        if(!scoreRes.ok) {
            setSeverity(`error`);
            setStatusMsg(error);
        } else if (score) {
            if(score == -1) {
                setSeverity(`warning`);
                setStatusMsg(`No scores have been added for this product with this production date.`);
            } else {
                setScore(score);
                setStatusMsg('Success! We found your product along with its current scores.')
                setSeverity(`success`);
            }
        } 
    }

}

export default ProductSearch;