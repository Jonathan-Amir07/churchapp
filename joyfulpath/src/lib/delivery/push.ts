export async function sendPushNotification(notification: any) {
  // TODO: integrate with FCM / APNs. For now, log and simulate.
  console.log('Push notification (simulated):', notification.id, notification.payload);
  return true;
}

export default { sendPushNotification };
