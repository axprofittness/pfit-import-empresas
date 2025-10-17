import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { Client } from 'pg';


const dynamo = new DynamoDBClient({});

export async function getPgClient(keyCompanie: string): Promise<Client> {
  const cmd = new GetItemCommand({
    TableName: 'EmpresaConexoes',
    Key: { keyCompanie: { S: keyCompanie } }
  });
  const res = await dynamo.send(cmd);
  const connStr = res.Item?.connectionString?.S;
  if (!connStr) throw new Error('Conexão não encontrada para keyCompanie: ' + keyCompanie);

  const pg = new Client({ connectionString: connStr });
  await pg.connect();
  return pg;
}
