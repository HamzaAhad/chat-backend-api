"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface
      .addColumn(
        "users", // name of Source model
        "userId", // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: "user_friend_association", // name of Target model
            key: "id", // key in Target model that we're referencing
          },
          defaultValue: 1,
          allowNull: false,
        }
      )
      .then(() => {
        return queryInterface.addColumn(
          "users", // name of Source model
          "friendId", // name of the key we're adding
          {
            type: Sequelize.INTEGER,
            references: {
              model: "user_friend_association", // name of Target model
              key: "id", // key in Target model that we're referencing
            },
            defaultValue: 1,
            allowNull: false,
          }
        );
      });
    // .then(() => {
    //   return queryInterface.addColumn(
    //     "users", // name of Source model
    //     "senderId", // name of the key we're adding
    //     {
    //       type: Sequelize.INTEGER,
    //       references: {
    //         model: "friend_requests", // name of Target model
    //         key: "id", // key in Target model that we're referencing
    //       },
    //       defaultValue: 1,
    //       allowNull: false,
    //     }
    //   );
    // })
    // .then(() => {
    //   return queryInterface.addColumn(
    //     "users", // name of Source model
    //     "receiverId", // name of the key we're adding
    //     {
    //       type: Sequelize.INTEGER,
    //       references: {
    //         model: "friend_requests", // name of Target model
    //         key: "id", // key in Target model that we're referencing
    //       },
    //       defaultValue: 1,
    //       allowNull: false,
    //     }
    //   );
    // })
    // .then(() => {
    //   return queryInterface.addColumn(
    //     "users", // name of Source model
    //     "receiverId", // name of the key we're adding
    //     {
    //       type: Sequelize.INTEGER,
    //       references: {
    //         model: "chats", // name of Target model
    //         key: "id", // key in Target model that we're referencing
    //       },
    //       defaultValue: 1,
    //       allowNull: false,
    //     }
    //   );
    // })
    // .then(() => {
    //   return queryInterface.addColumn(
    //     "users", // name of Source model
    //     "senderId", // name of the key we're adding
    //     {
    //       type: Sequelize.INTEGER,
    //       references: {
    //         model: "chats", // name of Target model
    //         key: "id", // key in Target model that we're referencing
    //       },
    //       defaultValue: 1,
    //       allowNull: false,
    //     }
    //   );
    // });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
