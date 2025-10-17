import { ImportService } from './application/ImportService';

export const handler = async (event: any) => {
  const importService = new ImportService();
  const resultados = await importService.importAllEmpresas();
  return {
    statusCode: 200,
    body: JSON.stringify(resultados)
  };
};
