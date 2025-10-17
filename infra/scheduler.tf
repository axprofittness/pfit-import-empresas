# EventBridge Schedule para chamar o import automaticamente
resource "aws_scheduler_schedule" "import_empresas_daily" {
  name                = "pfit-import-empresas-daily"
  description         = "Executa import de empresas diariamente às 2h"
  schedule_expression = "cron(0 2 * * ? *)"

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:elasticloadbalancingv2:invoke"
    role_arn = aws_iam_role.eventbridge_scheduler_role.arn

    http_parameters {
      path_parameter_values    = {}
      query_string_parameters  = {}
      header_parameters = {
        "Content-Type" = "application/json"
      }
    }

    # URL do ALB + endpoint
    arn = "https://${aws_lb.main.dns_name}/import-empresas"
  }
}

# IAM Role para o EventBridge
resource "aws_iam_role" "eventbridge_scheduler_role" {
  name = "eventbridge-scheduler-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "scheduler.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "eventbridge_scheduler_policy" {
  name = "eventbridge-scheduler-policy"
  role = aws_iam_role.eventbridge_scheduler_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "elasticloadbalancing:*"
        ]
        Resource = "*"
      }
    ]
  })
}