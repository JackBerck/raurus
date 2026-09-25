async function getFreeModels() {
  const res = await fetch('https://openrouter.ai/api/v1/models');
  const json = await res.json();
  const free = json.data
    .filter((m: any) => m.id.endsWith(':free'))
    .map((m: any) => m.id);
  console.log('Active :free models count:', free.length);
  console.log('List of :free models:', free);
}

getFreeModels();
