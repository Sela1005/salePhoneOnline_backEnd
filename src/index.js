const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const routes = require('./routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const crypto = require('crypto');

const { default: axios } = require("axios");



dotenv.config();


const app = express();
const port = process.env.PORT || 5082;


const corsOptions = {
    origin: 'http://localhost:5085', // Thay đổi thành địa chỉ frontend của bạn
    credentials: true, // Cho phép gửi cookie
};


app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }))
app.use(cookieParser())

routes(app);


mongoose.connect(process.env.MONGO_DB)
.then(() => { 
    console.log('Connect DB Success!')
})
.catch((err) => {
    console.log(err)
})


app.listen(port, () => {
    console.log('Server running on port:', + port)
})

var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
//Tạo link thanh toán
app.post("/payment", async (req, res) => {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters

    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var ipnUrl = 'https://1b9e-113-23-35-209.ngrok-free.app/callback';
    var requestType = "payWithMethod";
    var amount = '50000';
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData ='';
    var orderGroupId ='';
    var autoCapture =true;
    var lang = 'vi';
    
    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)
    
    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        partnerName : "Test",
        storeId : "MomoTestStore",
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        lang : lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData : extraData,
        orderGroupId: orderGroupId,
        signature : signature
    });
    
    //option for axios 
    //sử dụng để cấu hình một yêu cầu POST với thư viện Axios nhằm gọi API của MoMo
        const options = {
            method: "POST",
            url:"https://test-payment.momo.vn/v2/gateway/api/create",
            headers:{
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            },
            data: requestBody 
        }
    
    let result;
        try
        {
        result = await axios(options);
        return res.status(200).json(result.data);
        }
    catch(error)
    {
        return res.status(500).json({
            statusCode: 500,
            message: "server error"
        })
    } 
    })

app.post("/callback", async(req, res) => {

    console.log("callback:: ");
    console.log(req.body);
    //update order 
    return res.status(200).json(req.body);
    
})

// api check trang thai giao dich
app.post("/transactionstatus", async(req,res)=>{
const{orderId} = req.body;
const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
const signature = crypto
    .createHmac("sha256",secretKey)
    .update(rawSignature)
    .digest('hex');
    
    const requestBody = JSON.stringify({
        partnerCode:"MOMO",
        requestId: orderId,
        orderId: orderId,
        signature: signature,
        lang:'vi'
    })

    //option for axious
    const options = {
        method:"POST",
        url:'https://test-payment.momo.vn/v2/gateway/api/query',
        headers:{
            'Content-Type': 'application/json'

        },
        data: requestBody
    }
    //call api 
    let result = await axios(options);


    return res.status(200).json(result.data);
})