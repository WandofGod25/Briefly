import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasPublishableKey:"pk_test_YnJpZWYtY29yYWwtNTQuY2xlcmsuYWNjb3VudHMuZGV2JA",
    hasSecretKey:"sk_test_oQGVcZlQXMsOdQRR7rb8XCjTk0VZYRSrniP1r1RxO3",
    publishableKeyPrefix:"pk_test_YnJpZWYtY29yYWwtNTQuY2xlcmsuYWNjb3VudHMuZGV2JA"?.substring(0, 8),
  });
} 