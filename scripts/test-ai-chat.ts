async function testChat() {
  console.log('Testing AI chat...');
  const res = await fetch('http://localhost:3000/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Berapa pengeluaran saya hari ini?' }),
  });
  console.log('Chat response status:', res.status);
}
