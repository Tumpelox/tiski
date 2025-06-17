'use server';

import { Feedback, FeedbackDatabase } from '@/interfaces/feedback.interface';
import { feedbackSchema } from '@/schemas/feedback.schema';
import { createDocumentWithApi } from '@/services/databases';
import { ToastType } from '@/store';
import { ID } from 'node-appwrite';
import { z } from 'zod';

export const sendFeedback = async (
  feedback: z.infer<typeof feedbackSchema>
) => {
  const { data, success } = feedbackSchema.safeParse(feedback);

  if (!success) {
    return {
      message: 'Virheellinen pyyntö',
      type: ToastType.ERROR,
      data: null,
    };
  }

  const { feedbackName, feedbackMessage, recaptchaToken } = data;

  const reCaptcha = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.RECAPTCHA_PROJECT_ID}/assessments?key=${process.env.RECAPTCHA_API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify({
        event: {
          token: recaptchaToken,
          expectedAction: 'feedback_submit',
          siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        },
      }),
    }
  );

  const reCaptchaResponse = await reCaptcha.json();

  if (reCaptchaResponse.riskAnalysis.score < 0.5) {
    return {
      message: 'Palautteen lähettäminen epäonnistui, yritä myöhemmin uudelleen',
      type: ToastType.ERROR,
      data: null,
    };
  }

  const { error } = await createDocumentWithApi<Feedback>(
    FeedbackDatabase.DatabaseId,
    FeedbackDatabase.CollectionId,
    ID.unique(),
    {
      feedbackName,
      feedbackMessage,
      reCaptchaScore: reCaptchaResponse.riskAnalysis.score,
      trashed: false,
    }
  );

  if (error) {
    console.log(error);
    return {
      message: 'Palautteen lähettäminen epäonnistui, yritä myöhemmin uudelleen',
      type: ToastType.ERROR,
      data: null,
    };
  }

  return {
    message: 'Palautteesi on lähetetty onnistuneesti',
    type: ToastType.SUCCESS,
    data: null,
  };
};
