const health = process.env.HEALTH;
console.log('AAAAAA' + health);
module.exports = () => health === 'healthy';
