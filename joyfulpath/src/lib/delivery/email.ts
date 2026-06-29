export async function sendEmailNotification(notification: any) {
  // TODO: integrate with SendGrid / SES. For now, log and simulate.
  console.log('Email notification (simulated):', notification.id, notification.payload);
  return true;
}

export default { sendEmailNotification };
