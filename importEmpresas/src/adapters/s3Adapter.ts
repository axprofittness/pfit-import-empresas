import { Client as PgClient } from 'pg';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export async function importFromS3(pg: PgClient, empresa: { keyCompanie: string; fonte: string; hash: string }) {
  const s3 = new S3Client({});
  const bucket = process.env.S3_BUCKET || 'nome-do-bucket';
  const key = empresa.hash;

  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  const res = await s3.send(cmd);
  if (!res.Body) throw new Error('Arquivo não encontrado no S3');

  // Supondo que o arquivo seja JSON
  const body = await res.Body.transformToString();
  const registros = JSON.parse(body);

  // Exemplo: gravar cada registro na tabela
  for (const registro of registros) {
    // Adapte para sua tabela e campos
    await pg.query('INSERT INTO tabela_destino (dados) VALUES ($1)', [JSON.stringify(registro)]);
  }

  return { status: 'Importação S3 executada', empresa: empresa.keyCompanie, registros: registros.length };
}
