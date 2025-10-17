import { SchedulerClient, CreateScheduleCommand } from "@aws-sdk/client-scheduler";

/**
 * Exemplo de como criar um EventBridge Schedule para chamar o import automaticamente
 * Execute este script uma vez para configurar o agendamento
 */

const client = new SchedulerClient({ region: "us-east-1" });

const createImportSchedule = async () => {
  const command = new CreateScheduleCommand({
    Name: "pfit-import-empresas-daily",
    Description: "Executa import de empresas diariamente às 2h",
    ScheduleExpression: "cron(0 2 * * ? *)", // Todo dia às 2h da manhã
    Target: {
      Arn: "arn:aws:scheduler:::aws-sdk:elasticloadbalancingv2:invoke",
      RoleArn: "arn:aws:iam::YOUR-ACCOUNT:role/EventBridgeSchedulerRole",
      HttpParameters: {
        PathParameterValues: {},
        QueryStringParameters: {},
        HeaderParameters: {
          "Content-Type": "application/json"
        }
      },
      // URL do seu ALB + endpoint
      Arn: "https://your-alb-dns.region.elb.amazonaws.com/import-empresas"
    },
    FlexibleTimeWindow: {
      Mode: "OFF"
    },
    State: "ENABLED"
  });

  try {
    const response = await client.send(command);
    console.log("Schedule criado:", response.ScheduleArn);
  } catch (error) {
    console.error("Erro ao criar schedule:", error);
  }
};

// Descomente para executar
// createImportSchedule();