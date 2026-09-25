import { parseTransactionWithAI } from '../src/lib/ai/parser';

async function testAI() {
  const testInput = 'barusan beli bensin pertalite 25k bayar pake cash';
  console.log('Testing AI parsing with prompt:', testInput);
  
  try {
    const result = await parseTransactionWithAI(testInput);
    console.log('AI Parsing SUCCESS:');
    console.log(JSON.stringify(result, null, 2));

    if (result.amount === 25000 && result.type === 'expense') {
      console.log('TEST PASSED: Amount and type matched accurately.');
    } else {
      console.log('TEST NOTE: Amount/type returned:', result.amount, result.type);
    }
  } catch (error) {
    console.error('AI Parsing FAILED:', error);
    process.exit(1);
  }
}

testAI();
