resource "aws_lambda_function" "remediation_lambda" {
  filename         = "../build/remediation.zip"
  function_name    = "${var.envname}AutoRemediation"
  description      = "auto remediation - ${var.useremail}"
  role             = "${var.lambdaRole}"
  handler          = "remediation.handler"
  source_code_hash = "${base64sha256(file("../build/remediation.zip"))}"
  runtime          = "nodejs6.10"

  environment {
    variables = {
      NODE_ENV = "${var.envname}"
    }
  }

  tags {
    Usage = "Autoremediation demo",
    Category = "DEV",
    Email = "${var.useremail}",
    Environment = "${var.envname}",
  }
}