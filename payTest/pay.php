<?php
ini_set('date.timezone', 'Asia/Shanghai');
require_once "lib/WxPay.Api.php";
require_once "WxPay.JsApiPay.php";

// ①、获取用户openid
$tools = new JsApiPay();
$openId = $tools->GetOpenid();

// 产品信息
// $order_id = $_GET["order_id"];//订单号
// $price = $_GET["price"];//金额
// $order_name = $_GET["order_name"];//商品名称
// $prouductKey = $_GET["prouductKey"];//商品标示

// ②、统一下单
$input = new WxPayUnifiedOrder();
$input->SetBody("test");
$input->SetAttach("test");
$input->SetOut_trade_no(WxPayConfig::MCHID . date("YmdHis"));
$input->SetTotal_fee("1");
$input->SetTime_start(date("YmdHis"));
$input->SetTime_expire(date("YmdHis", time() + 600));
$input->SetGoods_tag("test");
$input->SetNotify_url(WxPayConfig::NOTIFY_URL);
$input->SetTrade_type("JSAPI");
$input->SetOpenid($openId);
$order = WxPayApi::unifiedOrder($input);
$jsApiParameters = $tools->GetJsApiParameters($order);

// ③、在支持成功回调通知中处理成功之后的事宜，见 notify.php
/**
 * 注意：
 * 1、当你的回调地址不可访问的时候，回调通知会失败，可以通过查询订单来确认支付是否成功
 * 2、jsapi支付时需要填入用户openid，WxPay.JsApiPay.php中有获取openid流程 （文档可以参考微信公众平台“网页授权接口”，
 * 参考http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html）
 */
?>

<html>
<head>
<meta http-equiv="content-type" content="text/html;charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>微信安全支付</title>
<script type="text/javascript">

	//调用微信JS api 支付
	window.onload = function ()	{
		WeixinJSBridge.invoke(
			'getBrandWCPayRequest',
			<?php echo $jsApiParameters; ?>,
			function(res){
				WeixinJSBridge.log(res.err_msg);
				alert(res.err_code+res.err_desc+res.err_msg);
			}
		);
	}
	</script>
</head>
<body>
</body>
</html>