import { getEmpresasFonte } from '../infra/empresaFonteDb';
import { getPgClient } from '../infra/factoryDb';
import { importFromAFitness } from '../adapters/afitnessApiAdapter';

export class ImportService {
  async importAllEmpresas() {
    const empresas = await getEmpresasFonte();
    const resultados: any[] = [];
    for (const empresa of empresas) {
      try {
        const pg = await getPgClient(empresa.keyCompanie);
        let resultado;
        switch (empresa.keyCompanie) {
          case 'AFitness':
            resultado = await importFromAFitness(pg, empresa);
            break;
          // case 's3':
          //   resultado = await importFromS3(pg, empresa);
          //   break;
          default:
            resultado = { status: 'Fonte não implementada', fonte: empresa.fonte };
        }
        await pg.end();
        resultados.push({ empresa: empresa.keyCompanie, resultado });
      } catch (err) {
        resultados.push({ empresa: empresa.keyCompanie, erro: err instanceof Error ? err.message : String(err) });
      }
    }
    return resultados;
  }
}
