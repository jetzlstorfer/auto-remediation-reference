resource "aws_api_gateway_resource" "remediation" {
  rest_api_id = "${aws_api_gateway_rest_api.auto_remediation.id}"
  parent_id = "${aws_api_gateway_rest_api.auto_remediation.root_resource_id}"
  path_part = "remediation"
}

resource "aws_api_gateway_method" "remediation_post_method" {
  rest_api_id   = "${aws_api_gateway_rest_api.auto_remediation.id}"
  resource_id   = "${aws_api_gateway_resource.remediation.id}"
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "remediation_integration" {
  rest_api_id             = "${aws_api_gateway_rest_api.auto_remediation.id}"
  resource_id             = "${aws_api_gateway_resource.remediation.id}"
  http_method             = "${aws_api_gateway_method.remediation_post_method.http_method}"
  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.remediation_lambda.arn}/invocations"
}

resource "aws_lambda_permission" "remediation_lambda_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.remediation_lambda.arn}"
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html

  #source_arn = "arn:aws:execute-api:us-east-1:478983378254:dsgq6nfp45/*/GET/hello"
  source_arn = "arn:aws:execute-api:${var.region}:${var.accountId}:${aws_api_gateway_rest_api.auto_remediation.id}/*/${aws_api_gateway_method.remediation_post_method.http_method}${aws_api_gateway_resource.remediation.path}"
}

resource "aws_api_gateway_method_response" "remediation_method_response_200" {
  rest_api_id = "${aws_api_gateway_rest_api.auto_remediation.id}"
  resource_id = "${aws_api_gateway_resource.remediation.id}"
  http_method = "${aws_api_gateway_method.remediation_post_method.http_method}"
  status_code = "200"
}

resource "aws_api_gateway_integration_response" "remediation_integration_response" {
  rest_api_id = "${aws_api_gateway_rest_api.auto_remediation.id}"
  resource_id = "${aws_api_gateway_resource.remediation.id}"
  http_method = "${aws_api_gateway_method.remediation_post_method.http_method}"
  status_code = "${aws_api_gateway_method_response.remediation_method_response_200.status_code}"
  depends_on = ["aws_api_gateway_integration.remediation_integration"]
}
