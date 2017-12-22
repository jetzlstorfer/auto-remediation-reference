variable "access_key" {}
variable "secret_key" {}
variable "region" {
  default = "emptyChangeIt"
}
variable "accountId" {
  default = "emptyChangeIt"
}

variable "envname" {
  default = "emptyChangeIt"
}
variable "useremail" {
  default = "please@define.com"
}

variable "lambdaRole" {
  default = "roleARN"
}

variable "myTags" {
  type = "map"
  default = {
    Usage = "Autoremediation demo",
  }
}