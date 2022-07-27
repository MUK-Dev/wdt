import moment from 'moment';

export const newDeadlineNotifications = (lists) => {
  const n = [];
  lists.map((l) => {
    if (l.deadline) {
      const deadline = JSON.parse(l.deadline);
      if (
        moment(deadline) > moment() &&
        moment(deadline).subtract(1, 'days') < moment()
      ) {
        n.push({
          message: `Deadline is close`,
          roomTitle: l.title,
        });
      }
    }
  });
  return n;
};
