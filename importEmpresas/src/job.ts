#!/usr/bin/env node

import { ImportService } from './application/ImportService';

async function runImportJob() {
  console.log('🚀 Iniciando job de importação de empresas...');
  console.log('⏰ Timestamp:', new Date().toISOString());
  
  try {
    const importService = new ImportService();
    console.log('📋 Executando importação...');
    
    const resultados = await importService.importAllEmpresas();
    
    console.log('✅ Importação concluída com sucesso!');
    console.log('📊 Resultados:', JSON.stringify(resultados, null, 2));
    
    // Log resumo
    const sucessos = resultados.filter(r => !r.erro).length;
    const erros = resultados.filter(r => r.erro).length;
    
    console.log(`📈 Resumo: ${sucessos} sucessos, ${erros} erros`);
    
    // Exit code 0 = sucesso
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro durante a importação:', error);
    
    if (error instanceof Error) {
      console.error('📋 Stack trace:', error.stack);
    }
    
    // Exit code 1 = erro
    process.exit(1);
  }
}

// Executar o job
runImportJob();