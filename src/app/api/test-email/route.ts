import { NextResponse } from "next/server";

import { resend } from "@/lib/resend";

export async function GET() {
  try {
    const testEmail =
      process.env.WEATHERSNAP_TEST_EMAIL;

    if (!testEmail) {
      return NextResponse.json(
        {
          error:
            "WEATHERSNAP_TEST_EMAIL is missing from the server environment.",
        },
        {
          status: 500,
        }
      );
    }

    const { data, error } =
      await resend.emails.send({
        from: "WeatherSnap <reports@weathersnap.app>",
        to: testEmail,
        subject: "WeatherSnap Test Email",
        html: `
          <div style="font-family: Arial, sans-serif; color: #1f2937;">
            <h2>WeatherSnap</h2>
            <p>This is a test email from WeatherSnap.</p>
            <p>If you received this message, Resend is connected successfully.</p>
          </div>
        `,
      });

    if (error) {
      console.error(
        "Resend test email failed:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to send test email.",
          details: error,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Test email route failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unexpected error sending test email.",
      },
      {
        status: 500,
      }
    );
  }
}