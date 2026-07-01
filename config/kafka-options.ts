import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

export interface KafkaRuntimeConfig {
  brokers: string[];
  clientId: string;
  groupId: string;
  topicPartitions: number;
  topicReplicationFactor: number;
}

export const readKafkaConfig = (
  configService: ConfigService,
): KafkaRuntimeConfig => ({
  brokers: configService.get<string[]>('kafka.brokers', ['localhost:9092']),
  clientId: configService.get<string>(
    'kafka.clientId',
    'nestjs-kafkajs-client',
  ),
  groupId: configService.get<string>(
    'kafka.groupId',
    'nestjs-kafkajs-learning-lab-api',
  ),
  topicPartitions: configService.get<number>('kafka.topicPartitions', 3),
  topicReplicationFactor: configService.get<number>(
    'kafka.topicReplicationFactor',
    1,
  ),
});

export const buildKafkaMicroserviceOptions = (
  config: KafkaRuntimeConfig,
): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: config.clientId,
      brokers: config.brokers,
    },
    consumer: {
      groupId: config.groupId,
    },
    producer: {
      allowAutoTopicCreation: false,
    },
    subscribe: {
      fromBeginning: false,
    },
  },
});

export const buildKafkaClientOptions = (
  config: KafkaRuntimeConfig,
): KafkaOptions => ({
  ...buildKafkaMicroserviceOptions(config),
  options: {
    ...buildKafkaMicroserviceOptions(config).options,
    consumer: {
      groupId: `${config.groupId}-producer-client`,
    },
  },
});
