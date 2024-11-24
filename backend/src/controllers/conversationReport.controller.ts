import { OK } from "../constants/http";
import ConversationReportModel from "../models/ConversationReport.model";
import { addConversationReport } from "../services/conversationReport.service";
import catchErrors from "../utils/catchErrors";
import { newConversationReportSchema } from "./conversationReport.schema";

export const addConversationReportHandler = catchErrors(
    async(req,res)=>{
        const request = newConversationReportSchema.parse(req.body);
        const {userId} = req
        const newTag= await addConversationReport({request, userId});

console.log(newTag);
return res.status(OK).json(newTag)

    }
)

export const getAllCoversationReportsHandler = catchErrors(
    async (req, res) => {
        const { topicId } = req.query;  // Przekazujemy topicId przez zapytanie

        // Przygotowanie zapytania do wyszukiwania, jeśli topicId jest podane
        const match = topicId ? { topic: topicId } : {};

        // Użycie agregacji do pobrania raportów i zliczenia zgłoszeń po temacie
        const allConversationReports = await ConversationReportModel.aggregate([
            {
                $match: match,  // Filtrowanie raportów po topic (jeśli podano topicId)
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
                $unwind: "$topicDetails",  // Rozpakowujemy dane tematu
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
    }
);