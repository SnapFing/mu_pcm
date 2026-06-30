[1mdiff --git a/packages/frontend/src/app/admin-portal/MinutesSection.js b/packages/frontend/src/app/admin-portal/MinutesSection.js[m
[1mindex 4f015cf..13638ce 100644[m
[1m--- a/packages/frontend/src/app/admin-portal/MinutesSection.js[m
[1m+++ b/packages/frontend/src/app/admin-portal/MinutesSection.js[m
[36m@@ -1,5 +1,6 @@[m
 import { useState, useEffect, useCallback } from 'react';[m
 import FileUpload from '@/app/ui/FileUpload';[m
[32m+[m[32mimport { downloadMinutesText, downloadMinutesPDF } from '@/app/utils/exportMinutes';[m
 [m
 const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';[m
 [m
[36m@@ -112,11 +113,26 @@[m [mexport default function MinutesSection({ token }) {[m
                 <h3 className="font-bold text-sm" style={{ color: '#0F2A4A' }}>{item.title}</h3>[m
                 <p className="text-xs mt-1" style={{ color: '#64748B' }}>{item.meetingDate ? new Date(item.meetingDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>[m
               </div>[m
[31m-              {item.fileUrl && ([m
[32m+[m[32m              {item.fileUrl ? ([m
                 <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}[m
                   className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200">[m
                   Download[m
                 </a>[m
[32m+[m[32m              ) : ([m
[32m+[m[32m                <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>[m
[32m+[m[32m                  <button[m
[32m+[m[32m                    onClick={() => downloadMinutesText(item)}[m
[32m+[m[32m                    className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200"[m
[32m+[m[32m                  >[m
[32m+[m[32m                    .txt[m
[32m+[m[32m                  </button>[m
[32m+[m[32m                  <button[m
[32m+[m[32m                    onClick={() => downloadMinutesPDF(item)}[m
[32m+[m[32m                    className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200"[m
[32m+[m[32m                  >[m
[32m+[m[32m                    PDF[m
[32m+[m[32m                  </button>[m
[32m+[m[32m                </div>[m
               )}[m
             </div>[m
           </div>[m
