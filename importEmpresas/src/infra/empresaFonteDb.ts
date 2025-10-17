import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const dynamo = new DynamoDBClient({});

export interface EmpresaFonte {
  keyCompanie: string;
  fonte: string;
  hash: string;
}

export async function getEmpresasFonte(): Promise<EmpresaFonte[]> {
  const cmd = new ScanCommand({ TableName: 'EmpresasFonte' });
  const res = await dynamo.send(cmd);
  return (res.Items || []).map(item => ({
    keyCompanie: item.keyCompanie?.S ?? '',
    fonte: item.fonte?.S ?? '',
    hash: item.hash?.S ?? ''
  }));
}
