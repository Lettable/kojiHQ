import Redis from 'ioredis';

let redis;

const REDIS_URL = 'redis://default:9SJd8wAOzfwlm0ykr5jRHLw1WiFzEZzb@redis-16654.c245.us-east-1-3.ec2.redns.redis-cloud.com:16654'

const connectRedis = () => {
  if (redis && redis.status === 'connecting') {
    console.log('Already connected to Redis.');
    return redis;
  }
  redis = new Redis(REDIS_URL, {
    connectionName: "sideProjector",
    keepAlive: 1,
  });

  redis.on('connect', () => {
    console.log('Connected to Redis');
  });
  return redis;
};

export default connectRedis;
