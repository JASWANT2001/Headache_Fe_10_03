import React, { useState } from 'react';
import Sidebar from "../components/Sidebar";
// Image Upload Validation Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


import {
  AlertCircle, CheckCircle, Info, ArrowLeft, Activity, Clock, Zap,
  Wind, AlertTriangle, Brain, Eye, Timer, Moon
} from 'lucide-react';

const flow = {
  start: {
    id: "start",
    question: "How did your headache begin?",
    options: [
      { label: "Abrupt", value: "abrupt", next: "abrupt_location" },
      { label: "Insidious", value: "insidious", next: "insidious_location" }
    ]
  },

  /* =======================
     ABRUPT – NEW ENTRY FLOW
     ======================= */

  abrupt_location: {
    id: "abrupt_location",
    question: "Is your headache unilateral or bilateral?",
    options: [
      { label: "Unilateral", value: "unilateral", next: "t_pattern_select" },
      { label: "Bilateral", value: "bilateral", next: "abrupt_redflags" }
    ]
  },

  abrupt_redflags: {
    id: "abrupt_redflags",
    question: "Select ANY ONE that applies",
    options: [
      { label: "Severe headache", value: "severe", next: "abrupt_secondary_eval" },
      {
        label: "Reaching maximum intensity in less than 1 minute",
        value: "thunderclap",
        next: "abrupt_secondary_eval"
      },
      {
        label: "Duration greater than 5 minutes",
        value: "duration",
        next: "abrupt_secondary_eval"
      },
      {

        label: "None of the above",
        value: "none",
        next: "result_others"
      }
    ]
  },

  abrupt_secondary_eval: {
    id: "abrupt_secondary_eval",
    question:
      "Evaluate for subarachnoid haemorrhage, intracerebral haemorrhage, cerebral venous thrombosis, unruptured vascular malformation (mostly aneurysm), arterial dissection (intra- and extracranial), reversible cerebral vasoconstriction syndrome (RCVS), pituitary apoplexy, meningitis, colloid cyst of the third ventricle, spontaneous intracranial hypotension and acute sinusitis (particularly with barotrauma).",
    options: [
      { label: "Yes", value: "yes", next: "result_secondary" },
      { label: "No", value: "no", next: "abrupt_cough" }
    ]
  },

  abrupt_cough: {
    id: "abrupt_cough",
    question:
      "At least two headache episodes brought on by and occurring only in association with coughing, straining and/or other Valsalva manoeuvre?",
    options: [
      { label: "Yes", value: "yes", next: "result_primary_cough" },
      { label: "No", value: "no", next: "abrupt_sexual" }
    ]
  },

  abrupt_sexual: {
    id: "abrupt_sexual",
    question:
      "At least 2 headache episodes precipitated by and occurring only during sexual activity?",
    options: [
      { label: "Yes", value: "yes", next: "result_sexual_activity" },
      { label: "No", value: "no", next: "abrupt_cold" }
    ]
  },

  abrupt_cold: {
    id: "abrupt_cold",
    question:
      "Headache brought on by a cold stimulus applied externally to the head or ingested or inhaled?",
    options: [
      { label: "Yes", value: "yes", next: "result_cold_stimulus" },
      { label: "No", value: "no", next: "abrupt_external_pressure" }
    ]
  },

  abrupt_external_pressure: {
    id: "abrupt_external_pressure",
    question:
      "At least two episodes of headache brought on by and occurring within 1 hour during sustained external compression of the forehead or scalp?",
    options: [
      { label: "Yes", value: "yes", next: "result_external_pressure" },
      { label: "No", value: "no", next: "abrupt_stabbing" }
    ]
  },

  abrupt_stabbing: {
    id: "abrupt_stabbing",
    question:
      "Head pain occurring spontaneously as a single stab or series of stabs, each lasting a few seconds, with no cranial autonomic symptoms?",
    options: [
      { label: "Yes", value: "yes", next: "result_primary_stabbing" },
      { label: "No", value: "no", next: "abrupt_thunderclap_check" }
    ]
  },


  abrupt_thunderclap_check: {
    id: "abrupt_thunderclap_check",
    question:
      "High-intensity headache of abrupt onset, mimicking that of ruptured cerebral aneurysm, in the absence of any intracranial pathology?",
    options: [
      { label: "Yes", value: "yes", next: "result_primary_thunderclap" },
      { label: "No", value: "no", next: "abrupt_hypnic_check" }
    ]
  },

  abrupt_hypnic_check: {
    id: "abrupt_hypnic_check",
    question:
      "Recurrent headache attacks developing only during sleep and causing wakening, occurring on ≥10 days/month for >3 months, lasting 15 minutes to 4 hours after waking, with no cranial autonomic symptoms?",
    options: [
      { label: "Yes", value: "yes", next: "result_hypnic" },
      { label: "No", value: "no", next: "ndph_check" }
    ]
  },

  ndph_check: {
    id: "ndph_check",
    question:
      "Persistent headache, daily from its onset, which is clearly remembered, lacking characteristic features and may be migraine-like or tension-type-like?",
    options: [
      { label: "Yes", value: "yes", next: "result_ndph" },
      { label: "No", value: "no", next: "abrupt_nummular" }
    ]
  },

  abrupt_nummular: {
    id: "abrupt_nummular",
    question:
      "Continuous or intermittent head pain felt exclusively in an area of the scalp that is sharply contoured, fixed in size and shape, round or elliptical, and 1–6 cm in diameter?",
    options: [
      { label: "Yes", value: "yes", next: "result_nummular" },
      { label: "No", value: "no", next: "result_others" }
    ]
  },

  //////////////////////////// End of Bilateral Flow



  t_pattern_select: {
    id: "t_pattern_select",
    question: "Associated with prominent cranial parasympathetic autonomic features, which are lateralized and ipsilateral to the headache?",
    options: [
      {
        label: "A. Atleast 5 attacks of Severe or very severe unilateral orbital, supraorbital and/or temporal pain lasting 15-180 minutes (when untreated) Occurring with a frequency between one every other day and 8 per day",
        value: "cluster",
        next: "cluster_autonomic_select"
      },

      {
        label:
          "B. At least 20 attacks of severe or very severe unilateral orbital, supraorbital and/or temporal pain lasting 2–30 minutes, occurring with a frequency of more than 5 per day",
        value: "ph",
        next: "ph_autonomic_select"
      },

      {
        label:
          "C. Present for more than 3 months, with exacerbations of moderate or greater intensity",
        value: "hc",
        next: "hc_autonomic_select"
      },

      {
        label:
          "D. Moderate or severe unilateral head pain with orbital, supraorbital, temporal and/or other trigeminal distribution, lasting 1–600 seconds, occurring as single stabs, series of stabs or in a saw-tooth pattern",
        value: "sunct",
        next: "sunct_distribution"
      },

    ]
  },

  t_autonomic_feature_select: {
    id: "t_autonomic_feature_select",
    question:
      "Select any ONE symptom present on the same side as the headache",
    options: [
      {
        label: "Conjunctival injection and/or lacrimation",
        value: "lacrimation",
        next: "t_autonomic_present"
      },
      {
        label: "Nasal congestion and/or rhinorrhoea",
        value: "nasal",
        next: "t_autonomic_present"
      },
      {
        label: "Eyelid oedema",
        value: "eyelid",
        next: "t_autonomic_present"
      },
      {
        label: "Forehead and facial sweating",
        value: "sweating",
        next: "t_autonomic_present"
      },
      {
        label: "Miosis and/or ptosis",
        value: "miosis",
        next: "t_autonomic_present"
      },
      {
        label: "None of the above",
        value: "none",
        next: "t_autonomic_absent"
      }
    ]
  },


  sunct_distribution: {
    id: "sunct_distribution",
    question:
      "Select the associated autonomic symptom present on the same side of the headache",
    options: [
      {
        label: "Conjunctival injection and/or lacrimation",
        value: "lacrimation",
        next: "sunct_frequency_check"
      },
      {
        label: "Nasal congestion and/or rhinorrhoea",
        value: "nasal",
        next: "sunct_frequency_check"
      },
      {
        label: "Eyelid oedema",
        value: "eyelid",
        next: "sunct_frequency_check"
      },
      {
        label: "Forehead and facial sweating",
        value: "sweating",
        next: "sunct_frequency_check"
      },
      {
        label: "Forehead and facial flushing",
        value: "flushing",
        next: "sunct_frequency_check"
      },
      {
        label: "Sensation of fullness in the ear",
        value: "ear_fullness",
        next: "sunct_frequency_check"
      },
      {
        label: "Miosis and/or ptosis",
        value: "miosis",
        next: "sunct_frequency_check"
      },
      {
        label: "None of the above",
        value: "none",
        next: "sunct_frequency_check"
      }
    ]
  },

  sunct_frequency_check: {
    id: "sunct_frequency_check",
    question:
      "At least 20 such attacks occurring at a frequency of at least 1 per day?",
    options: [
      { label: "Yes", value: "yes", next: "TEMP_SUNCT_YES" },
      { label: "No", value: "no", next: "result_others" }
    ]
  },


  sunct_yes_router: {
    id: "sunct_yes_router",
    type: "logic",
    resolve: (history) => {
      const autonomicStep = history.find(
        h => h.node === "sunct_distribution"
      );

      if (autonomicStep?.answer === "none") {
        return "result_probable_sunct";
      }

      return "result_sunct";
    }
  },




  cluster_autonomic_select: {
    id: "cluster_autonomic_select",
    question:
      "Select the associated autonomic symptom present on the same side of the headache",
    options: [
      {
        label: "Conjunctival injection and/or lacrimation",
        value: "lacrimation",
        next: "cluster_subtype_select",
      },
      {
        label: "Nasal congestion and/or rhinorrhoea",
        value: "nasal",
        next: "cluster_subtype_select"
      },
      {
        label: "Eyelid oedema",
        value: "eyelid",
        next: "cluster_subtype_select"
      },
      {
        label: "Forehead and facial sweating",
        value: "sweating",
        next: "cluster_subtype_select"
      },
      {
        label: "Miosis and/or ptosis",
        value: "miosis",
        next: "cluster_subtype_select"
      },
      {
        label: "None of the above",
        value: "none",
        next: "cluster_restlessness_check"
      }

    ]
  },

  cluster_subtype_select: {
    id: "cluster_subtype_select",
    question: "Which pattern best describes your cluster headache periods?",
    options: [
      {
        label:
          "At least two cluster periods lasting from 7 days to 1 year (when untreated) and separated by pain-free remission periods of ≥3 months",
        value: "episodic",
        next: "result_episodic_cluster"
      },
      {
        label:
          "Occurring without a remission period, or with remissions lasting <3 months, for at least 1 year",
        value: "chronic",
        next: "result_chronic_cluster"
      }
    ]
  },


  ph_autonomic_select: {
    id: "ph_autonomic_select",
    question:
      "Select the associated autonomic symptom present on the same side of the headache",
    options: [
      {
        label: "Conjunctival injection and/or lacrimation",
        value: "lacrimation",
        next: "ph_subtype_select"
      },
      {
        label: "Nasal congestion and/or rhinorrhoea",
        value: "nasal",
        next: "ph_subtype_select"
      },
      {
        label: "Eyelid oedema",
        value: "eyelid",
        next: "ph_subtype_select"
      },
      {
        label: "Forehead and facial sweating",
        value: "sweating",
        next: "ph_subtype_select"
      },
      {
        label: "Miosis and/or ptosis",
        value: "miosis",
        next: "ph_subtype_select"
      },
      {
        label: "None of the above",
        value: "none",
        next: "ph_restlessness_check"
      }
    ]
  },



  ph_restlessness_check: {
    id: "ph_restlessness_check",
    question: "A sense of restlessness or agitation during attacks?",
    options: [
      {
        label: "Yes",
        value: "yes",
        next: "result_paroxysmal_hemicrania"
      },
      {
        label: "No",
        value: "no",
        next: "result_probable_ph"
      }
    ]
  },



  ph_subtype_select: {
    id: "ph_subtype_select",
    question: "Which pattern best describes your headache periods?",
    options: [
      {
        label:
          "At least two headache periods lasting from 7 days to 1 year (when untreated) and separated by pain-free remission periods of ≥3 months",
        value: "episodic",
        next: "result_episodic_ph"
      },
      {
        label:
          "Occurring without a remission period, or with remissions lasting <3 months, for at least 1 year",
        value: "chronic",
        next: "result_chronic_ph"
      }
    ]
  },


  hc_autonomic_select: {
    id: "hc_autonomic_select",
    question:
      "Select any ONE autonomic symptom present on the same side as the headache",
    options: [
      {
        label: "Conjunctival injection and/or lacrimation",
        value: "lacrimation",
        next: "result_hemicrania_continua"
      },
      {
        label: "Nasal congestion and/or rhinorrhoea",
        value: "nasal",
        next: "result_hemicrania_continua"
      },
      {
        label: "Eyelid oedema",
        value: "eyelid",
        next: "result_hemicrania_continua"
      },
      {
        label: "Forehead and facial sweating",
        value: "sweating",
        next: "result_hemicrania_continua"
      },
      {
        label: "Miosis and/or ptosis",
        value: "miosis",
        next: "result_hemicrania_continua"
      },
      {
        label: "None of the above",
        value: "none",
        next: "hc_restlessness_check"
      }
    ]
  },


  hc_restlessness_check: {
    id: "hc_restlessness_check",
    question: "A sense of restlessness or agitation during attacks?",
    options: [
      {
        label: "Yes",
        value: "yes",
        next: "result_hemicrania_continua"
      },
      {
        label: "No",
        value: "no",
        next: "result_probable_hemicrania_continua"
      }
    ]
  },


  cluster_restlessness_check: {
    id: "cluster_restlessness_check",
    question: "A sense of restlessness or agitation during attacks?",
    options: [
      {
        label: "Yes",
        value: "yes",
        next: "result_cluster"
      },
      {
        label: "No",
        value: "no",
        next: "result_probable_cluster"
      }
    ]
  },

  // INSIDIOUS FLOW: 

  insidious_bilateral: {
    id: "insidious_bilateral",
    question: "Is your headache unilateral or bilateral?",
    options: [
      {
        label: "Unilateral",
        value: "unilateral",
        next: "insidious_unilateral_frequency"
      },
      {
        label: "Bilateral",
        value: "bilateral",
        next: "bilateral_sleep_check"
      }
    ]
  },

  insidious_unilateral_frequency: {
    id: "insidious_unilateral_frequency",
    question: "Did the headache last for less than 15 days in a month?",
    options: [
      {
        label: "Yes",
        value: "yes",
        next: "insidious_unilateral_less_15"
      },
      {
        label: "No",
        value: "no",
        next: "insidious_unilateral_more_15"
      }
    ]
  },

  insidious_unilateral_less_15: {
    id: "insidious_unilateral_less_15",
    question: "Continue insidious unilateral (<15 days/month) evaluation",
    options: [
      {
        label: "Continue",
        value: "continue",
        next: "result_other"
      }
    ]
  },

  insidious_unilateral_more_15: {
    id: "insidious_unilateral_more_15",
    question: "Continue insidious unilateral (≥15 days/month) evaluation",
    options: [
      {
        label: "Continue",
        value: "continue",
        next: "result_other"
      }
    ]
  },

  insidious_location: {
    id: "insidious_location",
    question: "Is your headache unilateral or bilateral?",
    options: [
      { label: "Unilateral", value: "unilateral", next: "insidious_lt15_check" },
      {
        label: "Bilateral",
        value: "bilateral",
        next: "insidious_bilateral_frequency"
      }
    ]
  },

  tth_infrequent_features: {
    id: "tth_infrequent_features",
    type: "checkbox",
    question: "Select all headache features that apply ",
    description: "Answer to atleast 2 is yes, out of 4",
    minRequired: 2,
    options: [
      { label: "Bilateral location", value: "bilateral" },
      {
        label: "Pressing or tightening (non-pulsating) quality",
        value: "pressing"
      },
      { label: "Mild or moderate pain intensity", value: "intensity" },
      {
        label:
          "Not aggravated by routine physical activity (e.g., walking or climbing stairs)",
        value: "activity"
      }
    ],
    next: "tth_infrequent_symptoms"
  },

  tth_infrequent_symptoms: {
    id: "tth_infrequent_symptoms",
    type: "checkbox",
    question: "During headaches, do you experience the following?",
    minRequired: 2,
    options: [
      { label: "No nausea or vomiting", value: "no_nausea" },
      {
        label:
          "No more than one of photophobia or phonophobia",
        value: "photo_phono_limit"
      }
    ],
    next: "result_infrequent_tth"
  },

  tth_frequent_features: {
    id: "tth_frequent_features",
    type: "checkbox",
    question: "Select all headache features that apply",
    description: "Answer to atleast 2 is yes out of 4",
    minRequired: 2,
    options: [
      { label: "Bilateral location", value: "bilateral" },
      {
        label: "Pressing or tightening (non-pulsating) quality",
        value: "pressing"
      },
      { label: "Mild or moderate pain intensity", value: "intensity" },
      {
        label:
          "Not aggravated by routine physical activity (e.g., walking or climbing stairs)",
        value: "activity"
      }
    ],
    next: "tth_frequent_symptoms"
  },

  tth_frequent_symptoms: {
    id: "tth_frequent_symptoms",
    type: "checkbox",
    question: "During headaches, do you experience the following?",
    minRequired: 2,
    options: [
      { label: "No nausea or vomiting", value: "no_nausea" },
      {
        label:
          "No more than one of photophobia or phonophobia",
        value: "photo_phono_limit"
      }
    ],
    next: "result_frequent_tth"
  },


  insidious_bilateral_frequency: {
    id: "insidious_bilateral_frequency",
    question: "Select the headache frequency pattern",
    options: [
      {
        label:
          "At least 10 episodes per month occurring on <1 day/month on average (<12 days/year)",
        value: "infrequent",
        next: "tth_infrequent_features"
      },
      {
        label: ">10 episodes over 1–14 days/month for 3 months",
        value: "frequent",
        next: "tth_frequent_features"
      },
      {
        label: "Headache >15 days a month",
        value: "chronic",
        next: "tth_chronic_features"
      }
    ]
  },


  insidious_lt15_check: {
    id: "insidious_lt15_check",
    question: "Did the headache last for less than 15 days in a month?",
    options: [
      { label: "Yes", value: "yes", next: "migraine_aura_check" },
      { label: "No", value: "no", next: "insidious_gt15_check" }
    ]
  },

  migraine_aura_check: {
    id: "migraine_aura_check",
    question:
      "Aura symptoms such as visual, sensory, speech, language, motor, brainstem or retinal?",
    options: [
      { label: "Yes", value: "yes", next: "migraine_aura_criteria" },
      { label: "No", value: "no", next: "migraine_no_aura_pain_features" }
    ]
  },

  migraine_no_aura_pain_features: {
    id: "migraine_no_aura_pain_features",
    type: "checkbox",
    question: "Had Atleast 5 attacks with duration 4-72 hours?",
    description: "Answer to atleast 2 is yes, out of 4",
    minRequired: 2,
    options: [
      { label: "Unilateral location", value: "unilateral" },
      { label: "Pulsating quality", value: "pulsating" },
      { label: "Moderate or severe pain intensity", value: "intensity" },
      {
        label:
          "Aggravation by or causing avoidance of routine physical activity (e.g., walking or climbing stairs)",
        value: "activity"
      }
    ],
    next: "migraine_no_aura_symptoms"
  },


  migraine_no_aura_symptoms: {
    id: "migraine_no_aura_symptoms",
    type: "checkbox",
    question: "During headaches, do you experience any of the following?",
    description: "Answer to atleast 1 is yes, out of 2",
    minRequired: 1,
    options: [
      { label: "Nausea and/or vomiting", value: "nausea" },
      { label: "Photophobia and phonophobia", value: "photo_phono" }
    ],
    next: "result_migraine_no_aura"
  },



  migraine_aura_criteria: {
    id: "migraine_aura_criteria",
    type: "checkbox",
    question: "Atleast 2 attacks with duration 4-72 hours",
    description: "Answer to atleast 3 is yes, out of 6",
    minRequired: 3,
    options: [
      {
        label: "At least one aura symptom spreads gradually over ≥5 minutes",
        value: "gradual_spread"
      },
      {
        label: "Two or more aura symptoms occur in succession",
        value: "succession"
      },
      {
        label: "Each individual aura symptom lasts 5–60 minutes",
        value: "duration"
      },
      {
        label: "At least one aura symptom is unilateral",
        value: "unilateral"
      },
      {
        label: "At least one aura symptom is positive",
        value: "positive"
      },
      {
        label:
          "The aura is accompanied, or followed within 60 minutes, by headache",
        value: "headache_follow"
      }
    ],
    next: "result_migraine_aura"
  },


  insidious_gt15_check: {
    id: "insidious_gt15_check",
    question: "Headache for more than 15 days a month for 3 months?",
    options: [
      { label: "Yes", value: "yes", next: "chronic_feature_select" },
      { label: "No", value: "no", next: "insidious_lt15_check" }
    ]
  },

  chronic_feature_select: {
    id: "chronic_feature_select",
    type: "checkbox",
    question: "Atleast 5 attacks with duration 4-72 hours?",
    description: "Answer to atleast 2 is yes, out of 4, for atleast 8 days a month",
    minRequired: 2,
    options: [
      { label: "Moderate or severe pain intensity", value: "intensity" },
      { label: "Pulsating quality", value: "pulsating" },
      {
        label:
          "Aggravation by or causing avoidance of routine physical activity (e.g., walking or climbing stairs)",
        value: "activity"
      },
      { label: "Unilateral location", value: "unilateral" },
      { label: "Atleast one of the above / None of the above", value: "none" }
    ],
    next: "chronic_migraine_symptom_select"
  },

  chronic_migraine_symptom_select: {
    id: "chronic_migraine_symptom_select",
    type: "checkbox",
    question: "During headaches, do you experience any of the following?",
    description: "Answer to atleast 1 is yes, out of 2, for atleast 8 days a month",
    minRequired: 1,
    options: [
      { label: "Nausea and/or vomiting", value: "nausea" },
      { label: "Photophobia and phonophobia", value: "photo_phono" }
    ],
    next: "result_chronic_migraine"
  },

  chronic_migraine_aura_criteria: {
    id: "chronic_migraine_aura_criteria",
    type: "checkbox",
    question: "Answer to atleast 3 is yes, out of 6, for atleast 8 days a month",
    minRequired: 3,
    options: [
      {
        label: "At least one aura symptom spreads gradually over ≥5 minutes",
        value: "gradual_spread"
      },
      {
        label: "Two or more aura symptoms occur in succession",
        value: "succession"
      },
      {
        label: "Each individual aura symptom lasts 5–60 minutes",
        value: "duration"
      },
      {
        label: "At least one aura symptom is unilateral",
        value: "unilateral"
      },
      {
        label: "At least one aura symptom is positive",
        value: "positive"
      },
      {
        label: "The aura is accompanied, or followed within 60 minutes, by headache",
        value: "headache_follow"
      }
    ],
    next: "result_chronic_migraine"
  },

  tth_chronic_features: {
    id: "tth_chronic_features",
    type: "checkbox",
    question: "Select all headache features that apply",
    description: "Answer to atleast 2 is yes, out of 4",
    minRequired: 2,
    options: [
      { label: "Bilateral location", value: "bilateral" },
      {
        label: "Pressing or tightening (non-pulsating) quality",
        value: "pressing"
      },
      { label: "Mild or moderate pain intensity", value: "intensity" },
      {
        label:
          "Not aggravated by routine physical activity (e.g., walking or climbing stairs)",
        value: "activity"
      }
    ],
    next: "tth_chronic_symptoms"
  },

  tth_chronic_symptoms: {
    id: "tth_chronic_symptoms",
    type: "checkbox",
    question: "During headaches, do you experience the following?",
    minRequired: 2,
    options: [
      {
        label:
          "No more than one of photophobia, phonophobia or mild nausea",
        value: "limited_symptoms"
      },
      {
        label:
          "Neither moderate nor severe nausea nor vomiting",
        value: "no_nausea_vomiting"
      }
    ],
    next: "result_chronic_tth"
  },



  // RESULTS
  result_primary_cough: {
    type: "result",
    title: "Primary Cough Headache",
    message:
      "The syndrome of cough headache is symptomatic in about 40% of cases, most commonly due to Arnold–Chiari malformation type I. Other reported causes include spontaneous intracranial hypotension, carotid or vertebrobasilar disease, posterior fossa tumours, midbrain cysts, basilar impression, subdural haematoma, cerebral aneurysms and reversible cerebral vasoconstriction syndrome. Diagnostic neuroimaging plays an important role in excluding secondary causes.",
    severity: "medium",
    icon: Wind,
    recommendations: []
  },

  result_primary_exercise: {
    type: "result",
    title: "Primary Exercise Headache",
    message:
      "On first occurrence of headache with these characteristics, it is mandatory to exclude subarachnoid haemorrhage, arterial dissection and reversible cerebral vasoconstriction syndrome.",
    severity: "medium",
    icon: Activity,
    recommendations: []
  },

  result_sexual_activity: {
    type: "result",
    title: "Primary Headache Associated with Sexual Activity",
    message:
      "On first onset of headache with sexual activity, it is mandatory to exclude subarachnoid haemorrhage, intra- and extracranial arterial dissection and reversible cerebral vasoconstriction syndrome (RCVS).",
    severity: "urgent",
    icon: AlertTriangle,
    recommendations: []
  },

  result_primary_thunderclap: {
    type: "result",
    title: "Primary Thunderclap Headache",
    message:
      "Thunderclap headache is frequently associated with serious intracranial vascular disorders, particularly subarachnoid haemorrhage. Primary thunderclap headache should be a diagnosis of last resort, made only when all organic causes have been demonstrably excluded by normal brain imaging, including the cerebral vessels, and/or normal cerebrospinal fluid examination.",
    severity: "urgent",
    icon: Zap,
    recommendations: []
  },

  result_cold_stimulus: {
    type: "result",
    title: "Cold-Stimulus Headache",
    message:
      "Headache brought on by a cold stimulus applied externally to the head or ingested or inhaled.",
    severity: "low",
    icon: Wind,
    recommendations: []
  },

  result_external_pressure: {
    type: "result",
    title: "External-Pressure Headache",
    message:
      "External-pressure headache is a primary headache disorder because compression and traction are too subtle to cause damage to the scalp and represent physiological stimuli.",
    severity: "low",
    icon: Wind,
    recommendations: []
  },

  result_primary_stabbing: {
    type: "result",
    title: "Primary Stabbing Headache",
    message:
      "Primary stabbing headache may involve extratrigeminal regions and may shift location. When stabs are strictly localized to one area, structural changes at the site and in the distribution of the affected cranial nerve must be excluded.",
    severity: "low",
    icon: Zap,
    recommendations: []
  },

  result_nummular: {
    type: "result",
    title: "Nummular Headache",
    message:
      "Nummular headache is characterized by continuous or intermittent head pain felt exclusively in a sharply contoured, fixed area of the scalp. Pain intensity is usually mild to moderate but may be severe. Duration is highly variable and the disorder is frequently chronic.",
    severity: "low",
    icon: Wind,
    recommendations: []
  },

  result_hypnic: {
    type: "result",
    title: "Hypnic Headache",
    message:
      "Other possible causes of headache developing during sleep should be ruled out, particularly sleep apnoea, nocturnal hypertension, hypoglycaemia and medication overuse. Intracranial disorders must also be excluded.",
    severity: "medium",
    icon: Moon,
    recommendations: []
  },

  result_ndph: {
    type: "result",
    title: "New Daily Persistent Headache",
    message:
      "In all cases, secondary causes such as headache attributed to head trauma, increased cerebrospinal fluid pressure or low cerebrospinal fluid pressure should be excluded by appropriate investigations.",
    severity: "medium",
    icon: AlertCircle,
    recommendations: []
  },

  result_migraine_no_aura: {
    type: "result",
    title: "Migraine Without Aura",
    message:
      "When there is associated medication overuse, both diagnoses — Chronic migraine and Medication-overuse headache — should be applied.",
    severity: "medium",
    icon: Brain,
    recommendations: []
  },

  result_migraine_aura: {
    type: "result",
    title: "Migraine With Aura",
    message:
      "Patients may find it difficult to describe aura symptoms accurately. Prospective recording using an aura diary can clarify diagnosis. Migraine aura may be associated with headache that does not fulfil criteria for migraine without aura, but this is still regarded as migraine.",
    severity: "medium",
    icon: Eye,
    recommendations: []
  },

  result_chronic_migraine: {
    type: "result",
    title: "Chronic Migraine",
    message:
      "The most common cause of apparent chronic migraine is medication overuse. After withdrawal, many patients revert to episodic migraine, while others remain chronic. Patients meeting criteria for both Chronic migraine and Medication-overuse headache should receive both diagnoses.",
    severity: "medium",
    icon: AlertCircle,
    recommendations: []
  },

  result_infrequent_tth: {
    type: "result",
    title: "Infrequent Tension-Type Headache",
    message:
      "When headache fulfils criteria for both Probable migraine and Infrequent episodic tension-type headache, the definite diagnosis of Infrequent episodic tension-type headache should be given.",
    severity: "low",
    icon: CheckCircle,
    recommendations: []
  },

  result_frequent_tth: {
    type: "result",
    title: "Frequent Tension-Type Headache",
    message:
      "When headache fulfils criteria for both Probable migraine and Frequent tension-type headache, the definite diagnosis of Frequent tension-type headache should be given. This condition often coexists with Migraine without aura.",
    severity: "medium",
    icon: Clock,
    recommendations: []
  },

  result_chronic_tth: {
    type: "result",
    title: "Chronic Tension-Type Headache",
    message:
      "Chronic tension-type headache requires headache on 15 or more days per month. If criteria for both Chronic migraine and Chronic tension-type headache are fulfilled, only the diagnosis of Chronic migraine should be given.",
    severity: "medium",
    icon: AlertCircle,
    recommendations: []
  },

  result_episodic_cluster: {
    type: "result",
    title: "Episodic Cluster Headache",
    message:
      "Some patients may have both Cluster headache and Trigeminal neuralgia (cluster-tic syndrome). Both diagnoses should be applied, as both conditions must be treated for the patient to become headache free.",
    severity: "urgent",
    icon: AlertTriangle,
    recommendations: []
  },

  result_chronic_cluster: {
    type: "result",
    title: "Chronic Cluster Headache",
    message:
      "Cluster headache occurring without remission periods, or with remissions lasting less than three months, for at least one year.",
    severity: "urgent",
    icon: AlertTriangle,
    recommendations: []
  },

  result_paroxysmal_hemicrania: {
    type: "result",
    title: "Paroxysmal Hemicrania",
    message:
      "During part, but less than half, of the active time-course of Paroxysmal hemicrania, attacks may be less frequent.",
    severity: "medium",
    icon: Timer,
    recommendations: []
  },

  result_sunct: {
    type: "result",
    title: "Short-lasting Unilateral Neuralgiform Headache Attacks (SUNCT/SUNA)",
    message:
      "SUNCT and SUNA attacks may occur without a refractory period and can often be triggered repeatedly, in contrast to Trigeminal neuralgia.",
    severity: "medium",
    icon: Zap,
    recommendations: []
  },

  result_hemicrania_continua: {
    type: "result",
    title: "Hemicrania Continua",
    message:
      "Migrainous symptoms such as photophobia and phonophobia are often present in Hemicrania continua.",
    severity: "medium",
    icon: Brain,
    recommendations: []
  },

  result_probable_cluster: {
    type: "result",
    title: "Probable Cluster Headache",
    message:
      "This diagnosis applies when patients have not yet had a sufficient number of typical attacks or fail to fulfil one diagnostic criterion.",
    severity: "urgent",
    icon: AlertTriangle,
    recommendations: []
  },

  result_cluster: {
    type: "result",
    title: "Cluster Headache",
    message:
      "Cluster headache is characterized by attacks of severe or very severe strictly unilateral orbital, supraorbital and/or temporal pain lasting 15–180 minutes. Attacks occur with a frequency from one every other day to eight per day and are associated with ipsilateral cranial autonomic symptoms and/or a sense of restlessness or agitation.",
    severity: "urgent",
    icon: AlertTriangle,
    recommendations: []
  },

  result_probable_ph: {
    type: "result",
    title: "Probable Paroxysmal Hemicrania",
    message:
      "The pattern suggests Paroxysmal hemicrania, but diagnostic criteria are not fully met or indomethacin responsiveness has not been established.",
    severity: "medium",
    icon: Timer,
    recommendations: []
  },

  result_probable_sunct: {
    type: "result",
    title: "Probable Short-lasting Unilateral Neuralgiform Headache Attacks",
    message:
      "The clinical pattern suggests SUNCT or SUNA, but full diagnostic criteria are not met.",
    severity: "medium",
    icon: Zap,
    recommendations: []
  },

  result_probable_hemicrania_continua: {
    type: "result",
    title: "Probable Hemicrania Continua",
    message:
      "The pattern suggests Hemicrania continua, but confirmation with indomethacin or full criteria are pending.",
    severity: "medium",
    icon: Brain,
    recommendations: []
  },

  result_secondary: {
    type: "result",
    title: "Secondary Headache",
    message:
      "The headache pattern suggests a possible secondary cause. Appropriate medical evaluation and investigations are required.",
    severity: "medium",
    icon: AlertCircle,
    recommendations: []
  },

  result_episodic_ph: {
    type: "result",
    title: "Episodic Paroxysmal Hemicrania",
    message:
      "Paroxysmal hemicrania characterized by attacks occurring in distinct periods. At least two headache periods last from 7 days to 1 year (when untreated) and are separated by pain-free remission periods of ≥3 months. Attacks are severe, strictly unilateral, short-lasting (2–30 minutes), occur more than 5 times per day, are associated with ipsilateral cranial autonomic symptoms, and are prevented absolutely by indomethacin.",
    severity: "medium",
    icon: AlertCircle,
    recommendations: []
  },

  result_chronic_ph: {
    type: "result",
    title: "Chronic Paroxysmal Hemicrania",
    message:
      "Paroxysmal hemicrania occurring without remission periods, or with remissions lasting <3 months, for at least 1 year. Attacks are severe, strictly unilateral, short-lasting (2–30 minutes), occur more than 5 times per day, are associated with ipsilateral cranial autonomic symptoms, and are prevented absolutely by indomethacin.",
    severity: "medium",
    icon: AlertCircle,
    recommendations: []
  },
  result_others: {
    type: "result",
    title: "This leads to other headaches",
    message:
      "Based on the responses provided, the headache pattern does not match the diagnostic criteria for the headache types assessed in this pathway. This presentation may be consistent with other headache disorders not covered here and may require further clinical evaluation for accurate identification.",
    severity: "medium",
    icon: AlertCircle,
    recommendations: []
  },
}



export default function HeadacheAssessment({ patientInfo, doctorEmail }) {
  if (!patientInfo) {
    return <div className="p-6">Loading patient data...</div>;
  }
  const [currentNode, setCurrentNode] = useState('start');
  const [history, setHistory] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [multiSelection, setMultiSelection] = useState([]);
  const [checkedOptions, setCheckedOptions] = useState([]);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [patientImage, setPatientImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [diagnosisMatch, setDiagnosisMatch] = useState(null); // null | 'yes' | 'no'
const [diagnosisIssue, setDiagnosisIssue] = useState("");
const [remarks, setRemarks] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Only JPG, PNG or WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setImageError("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setPatientImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setPatientImage(null);
    setPreviewImage(null);
    setImageError(null);
  };


  const navigateTo = (nextNode, answer) => {
    setIsAnimating(true);
    const newStep = { node: currentNode, question: node.question, answer };
    const updatedHistory = [...history, { node: currentNode, answer }];
    setHistory(updatedHistory);
    setAssessmentHistory(prev => [...prev, newStep]);

    setTimeout(() => {
      setCurrentNode(nextNode);
      setIsAnimating(false);
    }, 300);
  };

  const goBack = () => {
    if (history.length > 0) {
      setIsAnimating(true);
      const newHistory = [...history];
      const previous = newHistory.pop();

      setTimeout(() => {
        setCurrentNode(previous.node);
        setHistory(newHistory);
        setIsAnimating(false);
      }, 300);
    }
  };

const handleSubmit = async () => {
    const resultNode = flow[currentNode];

    console.log("=== SUBMIT CLICKED ===");

    if (!patientInfo || !patientInfo._id) {
      console.error("Patient data not ready.");
      return;
    }

    if (!doctorEmail) {
      console.error("Doctor email required.");
      setSubmitStatus("error");
      return;
    }

    if (!patientImage) {
      setImageError("Please upload a patient image before submitting.");
      return;
    }

    if (!diagnosisMatch) {
      alert("Please indicate if the diagnosis matches your prescription.");
      return;
    }

    if (diagnosisMatch === "no" && !diagnosisIssue.trim()) {
      alert("Please describe the issue with the diagnosis.");
      return;
    }

    setSubmitStatus("loading");

    const finalFlow =
      assessmentHistory.length === 0
        ? history.map(step => ({
            node: step.node,
            question: flow[step.node]?.question || "",
            answer: step.answer
          }))
        : assessmentHistory;

console.log("=== FRONTEND DEBUG ===");
console.log("diagnosisMatch:", diagnosisMatch);
console.log("diagnosisIssue:", diagnosisIssue);  
console.log("remarks:", remarks);
console.log("=====================");

const payload = {
   doctorEmail,
      patientSnapshot: {
        name: patientInfo.name,
        age: patientInfo.age,
        headacheType: patientInfo.headacheType,
        severity: patientInfo.severity,
        remarks: patientInfo.notes || ""
      },
      assessments: {
        flow: finalFlow,
        result: {
          title: resultNode?.title || "",
          message: resultNode?.message || "",
          severity: resultNode?.severity || ""
        },
        completedAt: new Date()
      },
      diagnosisMatch: diagnosisMatch === "yes",
      diagnosisIssue: diagnosisMatch === "no" ? diagnosisIssue : "",
      remarks: remarks
    };
    const formData = new FormData();
    formData.append("image", patientImage);
    formData.append("assessment", JSON.stringify(payload));

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `//3.239.186.138:5001/api/patients/${patientInfo._id}/assessments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Backend Response:", data);

      if (data.success) {
        setSubmitStatus("success");
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1500);
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      console.error("Assessment submission error:", err);
      setSubmitStatus("error");
    }
  };

  const restart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentNode('start');
      setHistory([]);
      setIsAnimating(false);
    }, 300);
  };

  const node = flow[currentNode];
  const isResult = node.type === 'result';

  const checked = checkedOptions || [];
  const hasNone = checked.includes("none");
  const minRequired = node.minRequired ?? 1;

  const isValidSelection =
    (checked.length === 1 && hasNone) ||
    (!hasNone && checked.length >= minRequired);



  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'urgent':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-300',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          textColor: 'text-red-900',
          accentColor: 'bg-red-500'
        };
      case 'medium':
        return {
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-300',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          textColor: 'text-amber-900',
          accentColor: 'bg-amber-500'
        };
      case 'low':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-300',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          textColor: 'text-green-900',
          accentColor: 'bg-green-500'
        };
      default:
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-300',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-900',
          accentColor: 'bg-blue-500'
        };
    }
  };

  return (
    /* ─── ROOT: full-height scroll, responsive horizontal padding ─── */
    <div className="min-h-screen bg-[#f6f8fc] px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12 flex flex-col justify-center md:block">

      {/* ── PAGE HEADER ── */}
      <div className="max-w-[1300px] mx-auto w-full mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Headache Assessment
        </h1>
        <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
          International Classification of Headache Disorders – 3rd Edition
        </p>
      </div>


      {/* ── PATIENT INFO CARD ── */}
      {patientInfo && (
        <div className="max-w-[1300px] mx-auto w-full mb-6 sm:mb-8 md:mb-10">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div>
              <p className="text-xs text-gray-500">Patient</p>
              <p className="font-semibold text-gray-900 text-sm">{patientInfo.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Age</p>
              <p className="font-semibold text-gray-900 text-sm">{patientInfo.age}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Headache Type</p>
              <p className="font-semibold text-gray-900 text-sm">{patientInfo.headacheType || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Severity</p>
              <p className="font-semibold text-gray-900 text-sm">{patientInfo.severity || "—"}</p>
            </div>
          </div>
        </div>
      )}


      {/* ── ASSESSMENT CONTAINER ── */}
      <div className="max-w-[1300px] mx-auto w-full">
        <div
          className={`bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 ${
            isAnimating ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
          }`}
        >

          {!isResult ? (

            /* ── QUESTION PANEL ── */
            <div className="p-5 sm:p-8 md:p-12">

              {/* Question header row */}
              <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full">
                  Question {history.length + 1}
                </span>

                {history.length > 0 && (
                  <button
                    onClick={goBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                    Back
                  </button>
                )}
              </div>

              {/* Question text */}
              <div className="mb-6 sm:mb-8 md:mb-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">
                  {node.question}
                </h2>

                {node.description && (
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {Array.isArray(node.description)
                      ? node.description.join(" • ")
                      : node.description}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3 sm:space-y-4">

                {node.type === "checkbox" ? (
                  <>
                    {node.options.map((option, index) => {
                      const isChecked = checkedOptions.includes(option.value);
                      return (
                        <label
                          key={index}
                          className={`flex items-start p-4 sm:p-5 md:p-6 border rounded-xl cursor-pointer transition shadow-sm ${
                            isChecked
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-indigo-200 hover:shadow-md"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="mt-0.5 mr-3 sm:mt-1 sm:mr-4 h-4 w-4 sm:h-5 sm:w-5 accent-indigo-600 flex-shrink-0"
                            checked={isChecked}
                            onChange={() => {
                              setCheckedOptions((prev) =>
                                prev.includes(option.value)
                                  ? prev.filter((v) => v !== option.value)
                                  : [...prev, option.value]
                              );
                            }}
                          />
                          <span className="text-gray-900 font-medium text-sm sm:text-base leading-snug">
                            {option.label}
                          </span>
                        </label>
                      );
                    })}

                    {/* Next button */}
                    <button
                      disabled={!isValidSelection}
                      onClick={() => {
                        let nextNode = node.next;
                        if (
                          node.id === "chronic_feature_select" &&
                          checkedOptions.length === 1 &&
                          checkedOptions.includes("none")
                        ) {
                          nextNode = "chronic_migraine_aura_criteria";
                        }
                        setCheckedOptions([]);
                        navigateTo(nextNode, checkedOptions);
                      }}
                      className={`w-full mt-4 sm:mt-6 p-3.5 sm:p-4 rounded-lg font-semibold text-sm sm:text-base transition ${
                        isValidSelection
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      Next
                    </button>
                  </>

                ) : (

                  node.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (
                          currentNode === "sunct_frequency_check" &&
                          option.value === "yes"
                        ) {
                          const autonomicAnswer = history.find(
                            (h) => h.node === "sunct_distribution"
                          );
                          if (autonomicAnswer?.answer === "none") {
                            navigateTo("result_probable_sunct", option.value);
                          } else {
                            navigateTo("result_sunct", option.value);
                          }
                          return;
                        }
                        navigateTo(option.next, option.value);
                      }}
                      className="w-full p-4 sm:p-5 md:p-6 text-left border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 hover:bg-indigo-50 transition"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold mr-3 sm:mr-4 text-sm sm:text-base">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="font-medium text-gray-900 text-sm sm:text-base leading-snug">
                          {option.label}
                        </span>
                      </div>
                    </button>
                  ))

                )}
              </div>
            </div>

          ) : (

            /* ── RESULT PANEL ── */
            <div>
              {(() => {
                const config = getSeverityConfig(node.severity);
                const ResultIcon = node.icon || Info;

                return (
                  <>
                    {/* Result header */}
                    <div className={`${config.bgColor} p-5 sm:p-7 md:p-10 border-b ${config.borderColor}`}>
                      <div className="flex items-start gap-4 sm:gap-6">
                        <div className={`${config.iconBg} p-3 sm:p-4 md:p-5 rounded-xl flex-shrink-0`}>
                          <ResultIcon className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 ${config.iconColor}`} />
                        </div>
                        <div>
                          <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${config.textColor} mb-1 sm:mb-2`}>
                            {node.title}
                          </h2>
                          <p className={`${config.textColor} opacity-90 text-sm sm:text-base leading-relaxed`}>
                            {node.message}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Result actions */}
                    <div className="p-5 sm:p-7 md:p-10 space-y-4 sm:space-y-6">

                   {/* Patient image upload */}
                      <div className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-gray-50">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Upload Patient Image <span className="text-red-500">*</span>
                        </label>

                        {!previewImage && (
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            onChange={handleImageUpload}
                            className="block w-full text-sm text-gray-700"
                          />
                        )}

                        {imageError && (
                          <p className="text-red-500 text-sm mt-2">{imageError}</p>
                        )}

                        {!patientImage && !imageError && (
                          <p className="text-xs text-gray-500 mt-1">
                            Accepted formats: JPG, PNG, WEBP (Max 5MB)
                          </p>
                        )}

                        {previewImage && (
                          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                            <img
                              src={previewImage}
                              alt="Patient Preview"
                              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border"
                            />
                            <div className="flex flex-row sm:flex-col gap-2">
                              <button
                                type="button"
                                onClick={removeImage}
                                className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                              >
                                Remove Image
                              </button>
                              <label className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 text-center">
                                Change Image
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg, image/jpg, image/webp"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Diagnosis Match Question */}
                      <div className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-gray-50">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Does the diagnosis match with your prescription? <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4 sm:gap-6">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="diagnosisMatch"
                              value="yes"
                              checked={diagnosisMatch === "yes"}
                              onChange={(e) => {
                                setDiagnosisMatch(e.target.value);
                                setDiagnosisIssue(""); // Clear issue if switching to yes
                              }}
                              className="mr-2 h-4 w-4 accent-indigo-600"
                            />
                            <span className="text-sm text-gray-700">Yes</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="diagnosisMatch"
                              value="no"
                              checked={diagnosisMatch === "no"}
                              onChange={(e) => setDiagnosisMatch(e.target.value)}
                              className="mr-2 h-4 w-4 accent-indigo-600"
                            />
                            <span className="text-sm text-gray-700">No</span>
                          </label>
                        </div>

                        {/* Conditional Issue Field */}
                        {diagnosisMatch === "no" && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              What is the issue? <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              value={diagnosisIssue}
                              onChange={(e) => setDiagnosisIssue(e.target.value)}
                              placeholder="Describe the issue with the diagnosis..."
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                          </div>
                        )}
                      </div>

                      {/* General Remarks */}
                      <div className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-gray-50">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Remarks (Optional)
                        </label>
                        <textarea
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Add any additional notes or observations..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                      </div>

                      <button
                        onClick={restart}
                        className="w-full p-3.5 sm:p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                      >
                        Restart Assessment
                      </button>

                  <button
                        onClick={handleSubmit}
                        disabled={
                          submitStatus === "loading" ||
                          submitStatus === "success" ||
                          !patientImage ||
                          !diagnosisMatch ||
                          (diagnosisMatch === "no" && !diagnosisIssue.trim())
                        }
                        className={`w-full p-3.5 sm:p-4 rounded-lg font-semibold text-sm sm:text-base ${
                          submitStatus === "success"
                            ? "bg-green-500 text-white"
                            : submitStatus === "error"
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : !patientImage
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gray-800 hover:bg-gray-900 text-white"
                        }`}
                      >
                        {submitStatus === "loading"
                          ? "Submitting..."
                          : submitStatus === "success"
                          ? "✓ Submitted Successfully"
                          : submitStatus === "error"
                          ? "Retry Submit"
                          : "Submit Assessment"}
                      </button>

                      {submitStatus === "error" && (
                        <p className="text-red-500 text-sm text-center">
                          Submission failed. Please try again.
                        </p>
                      )}

                      {history.length > 0 && (
                        <button
                          onClick={goBack}
                          className="w-full p-3.5 sm:p-4 border border-gray-300 rounded-lg hover:border-gray-400 text-sm sm:text-base"
                        >
                          Review Previous Answer
                        </button>
                      )}

                    </div>
                  </>
                );
              })()}
            </div>

          )}
        </div>
      </div>

    </div>
  );
}