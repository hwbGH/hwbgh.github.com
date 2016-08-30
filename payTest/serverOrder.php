<?php
ini_set('date.timezone', 'Asia/Shanghai');
require_once "lib/WxPay.Api.php";
require_once "WxPay.JsApiPay.php";

// ①、获取用户openid
$tools = new JsApiPay();
$openId = $tools->GetOpenid();

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
echo $jsApiParameters;