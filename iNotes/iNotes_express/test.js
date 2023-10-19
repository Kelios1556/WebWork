const date = new Date();
console.log(date.toLocaleString('en-HK', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  weekday: "short",
  month: "short",
  day: "2-digit",    
  year: "numeric",
  hour12: false 
}).slice(12, 16));
