import mongoose from "mongoose";
import { OK } from "../constants/http";
import ConversationReportModel from "../models/ConversationReport.model";
import { addConversationReport } from "../services/conversationReport.service";
import catchErrors from "../utils/catchErrors";
import { newConversationReportSchema } from "./conversationReport.schema";

export const addConversationReportHandler = catchErrors(async (req, res) => {
  const request = newConversationReportSchema.parse(req.body);
  const { userId } = req;
  const newTag = await addConversationReport({ request, userId });

  return res.status(OK).json(newTag);
});

export const getAllCoversationReportsHandler = catchErrors(async (req, res) => {
  const { topicId, startDate, endDate } = req.query; // Przekazujemy topicId przez zapytanie

  // Przygotowanie zapytania do wyszukiwania, jeśli topicId jest podane

  let dateMatch: Record<string, any> = {};
  if (startDate || endDate) {
    const start = startDate ? new Date(String(startDate)) : null;
    const end = endDate ? new Date(String(endDate)) : null;

    dateMatch.createdAt = {
      ...(start && { $gte: start }),
      ...(end && { $lte: end }),
    };
  }

  const match = {
    ...(topicId && { topic: new mongoose.Types.ObjectId(String(topicId)) }), // Jawna konwersja topicId do string
    ...dateMatch,
  };

  // Użycie agregacji do pobrania raportów i zliczenia zgłoszeń po temacie
  const allConversationReports = await ConversationReportModel.aggregate([
    {
      $match: match, // Filtrowanie raportów po topic (jeśli podano topicId)
    },
    {
      $lookup: {
        from: "conversationtopics", // Nazwa kolekcji ConversationTopic
        localField: "topic", // Pole w ConversationReport, które odnosi się do "topic"
        foreignField: "_id", // Pole w ConversationTopic, do którego odnosi się "topic"
        as: "topicDetails", // Nowe pole, które zawiera szczegóły tematu
      },
    },
    {
      $unwind: "$topicDetails", // Rozpakowujemy dane tematu
    },
    {
      $group: {
        _id: "$topic", // Grupowanie po ID tematu
        topicTitle: { $first: "$topicDetails.title" }, // Zwracamy nazwę tematu
        reportCount: { $sum: 1 }, // Zliczamy zgłoszenia dla każdego tematu
      },
    },
    {
      $project: {
        topicTitle: 1, // Zwracamy nazwę tematu
        reportCount: 1, // Zwracamy liczbę zgłoszeń
      },
    },
    {
      $sort: {
        reportCount: -1, // Sortowanie malejąco według liczby zgłoszeń
      },
    },
  ]);

  return res.status(OK).json(allConversationReports);
});

export const getAllReports = catchErrors(async (req, res) => {
  const allConversationReports = await ConversationReportModel.find({});
  return res.status(OK).json(allConversationReports);
});
