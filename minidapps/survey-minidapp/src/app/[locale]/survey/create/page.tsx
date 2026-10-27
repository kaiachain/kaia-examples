"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWeb3 } from "../../../../context/Web3Provider.tsx";
import { createSurvey } from "../../../../hooks/browser/factory.tsx";
import {
  surveyCreateTranslations,
  SurveyCreateMessages,
} from "../../../../messages/index.ts";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation.js";

// Define the form schema using zod
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  desc: z.string().min(1, "Description is required"),
  questions: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        options: z
          .array(z.string().min(1, "Option is required"))
          .min(2, "At least 2 options are required"),
      })
    )
    .min(1, "At least one question is required"),
  targetNumber: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Target number must be a valid number",
  }),
  duration: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Duration must be a valid number",
  }),
  rewardPool: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Reward pool must be a valid number",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function DynamicForm() {
  const params = useParams();
  const locale = params.locale as keyof typeof surveyCreateTranslations;
  const messages: SurveyCreateMessages =
    surveyCreateTranslations[locale] || surveyCreateTranslations.en;
  const { provider } = useWeb3();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      desc: "",
      questions: [{ question: "", options: ["", ""] }],
      targetNumber: "",
      duration: "",
      rewardPool: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const appendOption = (questionIndex: number) => {
    const q = {
      question: getValues(`questions.${questionIndex}.question`),
      options: [...getValues(`questions.${questionIndex}.options`), ""],
    };
    remove(questionIndex);
    append(q);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const ops = getValues(`questions.${questionIndex}.options`);
    ops.splice(optionIndex, 1);
    const q = {
      question: getValues(`questions.${questionIndex}.question`),
      options: ops,
    };
    remove(questionIndex);
    append(q);
  };

  const onSubmit = async (data: FormData) => {
    if (!provider) {
      return;
    }
    const result = await createSurvey({
      provider,
      title: data.title,
      desc: data.desc,
      questions: data.questions,
      targetNumber: data.targetNumber,
      duration: data.duration,
      rewardPool: data.rewardPool,
    });

    console.log(result);
    if (result.status) {
      alert("Survey created successfully");
      router.push("/square/surveys/" + result.surveyContractAddress.args[0]);
    } else {
      alert("Failed to create survey");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 mb-5 w-80 lg:w-3/5 md:w-3/5 bg-slate-200 p-4 rounded-lg"
      >
        <div>
          <label className="block font-bold">{messages.title}</label>
          <input
            {...register("title")}
            className="border p-2 w-full"
            placeholder="Enter the title"
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block font-bold">{messages.description}</label>
          <textarea
            {...register("desc")}
            className="border p-2 w-full"
            placeholder="Enter the description"
          />
          {errors.desc && <p className="text-red-500">{errors.desc.message}</p>}
        </div>

        <div>
          <label className="block font-bold">{messages.questions}</label>
          {fields.map((field, index) => (
            <div key={field.id} className="border p-4 mb-4 space-y-2">
              <div>
                <input
                  {...register(`questions.${index}.question` as const)}
                  className="border p-2 w-full"
                  placeholder={`Question ${index + 1}`}
                />
                {errors.questions?.[index]?.question && (
                  <p className="text-red-500">
                    {errors.questions[index].question?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold">{messages.options}</label>
                {field.options.map((_, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <input
                      {...register(
                        `questions.${index}.options.${optionIndex}` as const
                      )}
                      className="border p-2 flex-1"
                      placeholder={`Option ${optionIndex + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index, optionIndex)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      {messages.removeOption}
                    </button>
                    {errors.questions?.[index]?.options?.[optionIndex] && (
                      <p className="text-red-500">
                        {errors.questions[index].options[optionIndex]?.message}
                      </p>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => appendOption(index)}
                  className="text-blue-500 underline"
                >
                  {messages.addOption}
                </button>
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                {messages.removeQuestion}
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ question: "", options: ["", ""] })}
            className="text-blue-500 underline"
          >
            {messages.addQuestion}
          </button>
        </div>

        <div>
          <label className="block font-bold">{messages.targetNumber}</label>
          <input
            {...register("targetNumber")}
            className="border p-2 w-full"
            placeholder="Enter the target number"
          />
          {errors.targetNumber && (
            <p className="text-red-500">{errors.targetNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block font-bold">{messages.duration}</label>
          <input
            {...register("duration")}
            className="border p-2 w-full"
            placeholder="Enter the duration"
          />
          {errors.duration && (
            <p className="text-red-500">{errors.duration.message}</p>
          )}
        </div>

        <div>
          <label className="block font-bold">{messages.rewardPool}</label>
          <input
            {...register("rewardPool")}
            className="border p-2 w-full"
            placeholder="Enter the reward pool"
          />
          {errors.rewardPool && (
            <p className="text-red-500">{errors.rewardPool.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="flex flex-col bg-blue-500 text-white p-2 rounded"
        >
          {messages.submit}
        </button>
      </form>
    </div>
  );
}
