const { Sequelize, DataTypes } = require('sequelize');
import { setRequiredVariable } from '../../helpers';

const sequelize = new Sequelize(`postgres://${setRequiredVariable('USER_NAME')}:${setRequiredVariable('USER_PASSWORD')}@${setRequiredVariable('DB_URL')}:${setRequiredVariable('DB_PORT')}/${setRequiredVariable('DB_NAME')}`)


async function test() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

async function defineModal() {
  const User_Tasks = sequelize.define('Users_Tasks', {
    userEmail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userExchangeId: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    totalTasksUser: {
      type: DataTypes.BIGINT
    },
    totalVolumeByTasks: {
      type: DataTypes.BIGINT
    },
    lastUserTask: {
      type: DataTypes.TEXT
    },
    lastUserTaskCreatedDate: {
      type: DataTypes.DATE
    }
  });

  const Tasks = sequelize.define('Tasks', {
    taskID: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    taskOwnerEmail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    taskStatus: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    taskPair: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    taskInterval: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    taskAmount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    taskSpread: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    taskType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    taskExchange: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    taskExchangeAPIURL: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    taskTotalGeneratedVolume: {
      type: DataTypes.BIGINT
    },
    taskCreatedTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    taskLastStartTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    taskGeneratedVolume1HourAverage: {
      type: DataTypes.BIGINT
    }
  });


  const TaskStatus = sequelize.define('TaskStatus', {
    UUID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    taskID: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    taskOwnerEmail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    taskStatusChanged: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    taskStatusChangedTime: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  await sequelize.sync({force: true});

}

defineModal()