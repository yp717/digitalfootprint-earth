const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.aggregateAudits = functions.firestore
  .document("stories/{restId}")
  .onWrite(async (change, context) => {
    const id = context.params.restId 
    const { locked, environmentalData, performance, auditScores } = change.after.data();
    if (!locked) {
      db.collection('timelines').doc(id).set({
        timeline: admin.firestore.FieldValue.arrayUnion({date: new Date(), auditScores})
      }, {merge: true})
      const restRef = db.collection("stats").doc("global");
      await db.runTransaction(async (transaction) => {
        const restDoc = await transaction.get(restRef);
        const { auditCount, environment, size } = restDoc.data();
        const { green } = environmentalData.greenWebFoundation;
        const { totalSize, performanceScore } = performance;
        const newAuditCount = auditCount + 1;

        let newEnvironment = { ...environment };
        if (green) {
          newEnvironment.green += 1;
        } else {
          newEnvironment.notGreen += 1;
        }

        let newPerformance = { ...restDoc.data().performance };
        newPerformance.cumulitivePerf += performanceScore;
        newPerformance.perfCount += 1;
        newPerformance.averagePerf =
          newPerformance.cumulitivePerf / newPerformance.perfCount;

        let newSize = { ...size };
        newSize.cumulative += totalSize;
        newSize.count += 1;
        newSize.average = newSize.cumulative / newSize.count;

        transaction.update(restRef, {
          environment: newEnvironment,
          auditCount: newAuditCount,
          performance: newPerformance,
          size: newSize,
        });
      });
    }
  });
