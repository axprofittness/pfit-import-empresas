import express, { Request, Response } from 'express';
import { ImportService } from './application/ImportService';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint para o Fargate
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Endpoint para importar empresas
app.post('/import-empresas', async (req: Request, res: Response) => {
  try {
    const importService = new ImportService();
    const resultados = await importService.importAllEmpresas();
    res.status(200).json({
      success: true,
      data: resultados,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro no import:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint para importar empresas via GET (compatibilidade)
app.get('/import-empresas', async (req: Request, res: Response) => {
  try {
    const importService = new ImportService();
    const resultados = await importService.importAllEmpresas();
    res.status(200).json({
      success: true,
      data: resultados,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro no import:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
      timestamp: new Date().toISOString()
    });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido, encerrando servidor...');
  process.exit(0);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export { app };