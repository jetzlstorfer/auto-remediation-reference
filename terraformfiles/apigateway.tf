resource "aws_api_gateway_rest_api" "auto_remediation" {
 name        = "${var.envname}SelfHealing"
 description = "Used to fix problems on ${var.envname} environment juergen.etzlstorfer@dynatrace.com"
}

resource "aws_api_gateway_deployment" "testStageDeployment" {
  depends_on = ["aws_api_gateway_method.remediation_post_method", "aws_api_gateway_integration.remediation_integration" ]

  rest_api_id = "${aws_api_gateway_rest_api.auto_remediation.id}"
  stage_name  = "DEV"
}