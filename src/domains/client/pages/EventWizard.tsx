import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../core/components/ui/Button';
import { ArrowLeft, ArrowRight, Check, UploadCloud } from 'lucide-react';
import { EVENT_WIZARD_CONFIG } from '../config/eventWizardConfig';
import { EventCarousel } from '../components/EventCarousel';
import { StyleCarousel } from '../components/StyleCarousel';
import { supabase } from '../../../core/lib/supabase';
import { useAuth } from '../../auth/components/AuthProvider';
import { HexColorPicker } from "react-colorful";
import namer from "color-namer";


const STEPS = [
  { id: 1, title: 'Details', subtitle: 'Event basics' },
  { id: 2, title: 'Date & Timing', subtitle: 'When is your event?' },
  { id: 3, title: 'Location & Venue', subtitle: 'Where is it?' },
  { id: 4, title: 'Guest Count', subtitle: 'Who is coming?' },
  { id: 5, title: 'Requirements', subtitle: 'What do you need?' },
  { id: 6, title: 'Budget', subtitle: 'Event Logistics' },
  { id: 7, title: 'Look & Feel', subtitle: 'Style & references' },
];

const BUDGET_TIERS = [
  { id: 'under_0.5', label: 'Under 0.5L', min: '0', max: '0.5', desc: 'Intimate' },
  { id: '0.5_1', label: '0.5L – 1L', min: '0.5', max: '1', desc: 'Boutique' },
  { id: '1_3', label: '1L – 3L', min: '1', max: '3', desc: 'Mid-scale' },
  { id: '3_5', label: '3L – 5L', min: '3', max: '5', desc: 'Classic Grand' },
  { id: '5_10', label: '5L – 10L', min: '5', max: '10', desc: 'Most chosen for multi-day gatherings' },
  { id: '10_20', label: '10L – 20L', min: '10', max: '20', desc: 'Luxury Atelier' },
  { id: '20_plus', label: '20L and above', min: '20', max: '', desc: 'Bespoke Estate' },
];

const BUDGET_INCLUSIONS = [
  'Venue & Rental',
  'Catering & Food',
  'Decoration & Design',
  'Photo & Videography',
  'Entertainment & Music',
  'Planning & Day-of Coordination',
  'Guest Stay & Logistics',
  'Rentals & Audio-Visual'
];

const FLEXIBILITY_OPTIONS = [
  { id: 'strict', label: 'Strict budget', desc: 'My budget is fixed. Please prioritize planners who can work tightly within it.' },
  { id: 'slight', label: 'Slightly flexible', desc: 'I can increase my budget slightly (+10–15%) for the right creative proposal or premium talent.' },
  { id: 'flexible', label: 'Flexible', desc: 'I am open to adjusting my budget for the right concept and quality.' },
  { id: 'not_sure', label: 'Not sure yet', desc: 'I need guidance from planners on realistic costs for my vision.' }
];

const CITIES = ['Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Coimbatore'];

const VENUE_TYPES = [
  { id: 'wedding_hall', label: 'Wedding Hall', desc: 'A dedicated hall designed for wedding ceremonies and celebrations.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtyDdS7UJ4J0aXr-EHLsLE_Sq7UtTFa0AdxgiNOz4yrRifiLH4CTi9hDYjwL8CBF-cE5ZM7agm5lDHPPPllS-Nan_a2A2m-VHltG28HuFv-eC3OC5wNz_cgTExqX0kgGOfTIkMJBCJPOhRGSmXm6RBtGHwPgHYt-78qZr49IvW-kBvx4nDgdmlp9V4MTjzbUBecGXCWxZeea7jrlXlNnGFkNnJj5w_Szi4qUzQbY_WohZuFcWNuVn_fw' },
  { id: 'hotel_banquet', label: 'Hotel or Banquet Hall', desc: 'A refined indoor venue for formal celebrations and receptions.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLV8cgXe19YMnJZ_1F1hbj9pcJI76RbKeDbw5d-GtU4YKdGY1zwRAlIkVORIdzZhu5OlcCB2p47s-JLgwr_d2_4BaqbufUxJqxMswWMLxrXl09Cx1IJkCHeWk_bn6Xc-i5X8Ijv7UweRgyxeGl_Y2S7zWMMe5V18ZNS9S9Yg4CN332GBS9yeUzz6KYAuhwClcdj_kMKbOe1CKHXNUu4vUq-Zi1ED7euSX1lNt631k1HBQQ2iaoHA1CMQ' },
  { id: 'outdoor', label: 'Outdoor Venue', desc: 'An open-air setting surrounded by natural scenery.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDUpPHYFMGfGNIf4wj7Wrhsdw64CXn4Z9F41NiHYB__cmbr35-ver1jwappC-rROVGKgTBXs8VE0rxIcPHVfvE8yVlZvJTwc1HxtOo6czy8TppfKaTmZJItbmoKkSIyamMrfmlcxP0fT8mW5lfnSE-k1W094d-dl6xU9v3kYQWHj0HlFmPSQl3MXP-vvkkXYYMpwBxoA2S4Uf-wM9JAj1U9SMwtd49C3TRTQQcCbSuy0Eox3D7n2qU3A' },
  { id: 'beach', label: 'Beach', desc: 'A scenic seaside setting for a memorable celebration.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnZDaRAIIhcmpUOpemlFXU7K33zGcwFstcis_u04wmWsf2YvnoWqmmGV1IJ_s5XfisUkbbrAOh_07dY3aAQFz5DUT0wyVF0IfJPVV_kSi1A5wg1dZRm2scbYuMlqSDXUgDxGNz-Us1jYaqolIAGIBYqe44IyXd7WWGN9SRC02-ywnYRmL4bdmh5ly_cSuCE2uRbKgINuQ2zB1Qi7ZdkVPRTtTEXmkpcy5JqYf5qa4sAzTabkJDJCrBHQ' },
  { id: 'resort', label: 'Resort', desc: 'A destination-style setting with beautiful surroundings.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnMl8bDUOCFirQFQwonRGx_JQIDRXjpXyLnUQ-QAhimBS4VWm2t1Uh0EHT_eiP3nkrtRNwsvzSLlAY2_MS_4P9HOkeDPRBySybFMiihqxVsyPdSsQol5a7--Pw34HPUHdIUWQdPkcoHkEGl_RENRCHJMrImpMnjs2XpQWsrECIBGo3na4ynHRgyZTcI_zVfei95hAsEjsu49Eb1smXZt_7jM0-hOAPPuK9OLK_9e4CuSxqQFOYCMDYgg' },
  { id: 'home', label: 'Home or Private Property', desc: 'A personal setting for intimate gatherings and family events.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwl0-IjEhtlMZmhme0IFLiVUfUkB3tdAoQXYEuG1u4jFQgvL8CfFoukhX3bLK-5MjU-l4Bu5C95IMoOXYSW2nkjx2epeMr_AaK6yzG7PmZCQxvHCA8quKKbggPROaz7DkMjYr2Qt4E1KYkFMRlLl4xxdTgzfIsa-OpvtQdHk8a47fqOXrmu4AVFiUSgiAyEbO8GXrsprlazryld2P915F7fe2S7JW3hkl94MBROdUvuKu8unc-eqSSTg' },
  { id: 'auditorium', label: 'Auditorium', desc: 'A structured indoor venue for performances and formal events.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgZMhvRQfRgylwByYWWQ6JMcDpqCMNu5MbXIRltcYCDYAkXkMdtmOnbV0aEkoGyzdiOeO3WBX2kEnIwMNxxhjjWEQU5c_74poOzdPlmQbZ-FN-TWyaa5NcJS5wtRnqNkbr1uHieJr9wKq1Sm9LhKrOZnI4sjIobplBLTGNc05iH1LnbcLM6wnbdadsk90IJteyk0I9mAwJ13frsfYqg6mQmi1aiIGZAxr_qPdzjLjwcCsCij6bA4nang' },
  { id: 'open_ground', label: 'Open Ground', desc: 'A spacious venue for large gatherings and outdoor functions.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_AaAlQxFEQhJiVzVY0wyQrrNF9XUdwdv54fZoJfkO6VfLy5SE3RcgjpJqojeEOGE-oK7mZqpPRfvhYK1haV82CSBqN9FoCoLfmkiwEZU2vBA2CTjcVPzmizYGBZK75c2o9IdziHJ0RAVZwpG52IuNFuQBU0takYLGp9aRQgvbvyZ4xpj4ZcYTEUfKOFQbJCEdxrw-TmZUnStiMT_yTcc77xcdE0lDn0yTUS14WslchaXGT5lfgDn1hg' },
  { id: 'restaurant', label: 'Restaurant', desc: 'A welcoming dining space for smaller celebrations.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVKavU0YSBUNXcfqEMylRkP5k1N5z5d-6QhgdJro8wJ-eMPnSRaB0byccRnoMr2xrMnI8xthor9Fdq1993kBXa0pefjjGqBVhLYGKdFj-BnH_ETokOM-QCevnEBkv18YdIUZELnUgWGavDpZt4IQlLXuomRr37KsMHpWOJrY5LWBOKFNNUizU66ZwvS2cx8__0B5h7uYCv8UueOh79RMk_SONGiWg61i9KwP5hhoDpl3Foi1-b-tXXMg' },
  { id: 'other', label: 'Other Venue', desc: 'Have another type of venue in mind? Tell us about it.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXoZRyYepuioz-2UyYHBODU-WVCOZAw1RO3wZm05w9TmVWKon2yEuImx_DP7uZUyB2cmAAEMDqbLk4ndljnt1mzHGrp7ZsCQlp8ghAyWIk7AIQ65Q12ZFoC7Jh8uiU_gnKRgzKlnztlvc9_LLOI8L7hDdKRR8VGcv6LMzDz6X_R4meW73OCjsJBa5XP9ve3wQITNBIxqF_pnE-Pkm-sFJz3fvq6HoeusAlbzMqJyKe1Z8LIN8NVHbc3Q' },
  { id: 'not_decided', label: 'Venue Not Decided Yet', desc: 'Still deciding? We\'ll record your preferences and venue needs.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCje5NWIGI2kMDngCITBxjHrMjpBhm_KBxNSF7JyuHQpNgRjz_vlJmYoDGbaBTENASAr9n5xfnQI7Q0LXQW7L0AXSmdAFl_fgIKThQxuocTQ3GjWUulOIOQpzvsV10ZvDl8B8lJBuelV_M77ngYG6kFXXyTat5SO792HOOhSje00NJAbhH93NCZti4CeeVEW-pzSJhGFRjKcSvLb418ZikldC-Bo4hsnDzR4h7-kHmO95WG0_4sYn8rMg', colSpan: true }
];

const SERVICE_CATALOG = {
  planning: {
    title: "Planning & Management",
    desc: "Choose the level of planning and coordination your event needs.",
    items: [
      { id: "Full Event Planning", desc: "End-to-end planning and coordination for your event.", img: "" },
      { id: "Partial Event Planning", desc: "Support with selected aspects of your event.", img: "" }
    ]
  },
  decor: {
    title: "Decoration & Design",
    desc: "Explore visual styles and decoration services that bring your event to life.",
    items: [
      { id: "Stage Decoration", desc: "Design and decoration of the main event stage.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdjdG5jSqnRTlcVYIzCTYTbf3hI7_fN1NTYgKdrW8uEHMsdA96-OdtumkIZEa7j62HNP3ZRvUQVN2mpJcXZn0bNYkoIxMM005ZNxaBWIISjZ1vjbJuTblOrnOVUN0kxPBF1s2NC43ZVkIa1qklZIbljGxoSbx0k7ZYzms7SJsIwvj5C_4tb-vzEldKTx9tV8e_V1CI6EtaZlYEK-5Z98aRPSIZyl9LeS6JbOWpw0sF04wbfngB-VOy3g" },
      { id: "Mandapam Decoration", desc: "Traditional or contemporary mandapam setup.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf2I7FTN9OfLTSYfXSLB0FuKHx6LIHrMl9LGCPvYSPWoHVwDVEvHd7E_9ZzWBozBxqvlkAf1VVwroxNnwM7b-E9ZDm05sgqZ7slgNvp8Re7MbK3FTk-YuiTr5IdGs4lX3FEGeMZ3_A2O8rAaAxw3WHRUd1x7koJvb2Nk0lwq6z8hL0HINSywANieZFGOgXoyvAJaK1HU-R1i4pOzC9KL9RuIw6p34a4xnQyXj8K9mmKgycrNgphWhYPA" },
      { id: "Floral Decoration", desc: "Fresh or artificial floral arrangements & installations.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTw9QXjcWUYIlXN9abQ5Ry59CTve-MKAlKzw1UFySPUTbBWjnHTtms34KIeE9hV5824WbdZUj6AO9Jjuh3NsRjaAmAdSn3gUkiAw7inwKgM5X_hRJM0Si27HTiwdssVRKcS0qJ6uMv1bUodYgu3r8NXC7LwyYo2zXHPpzmUD9TIi9qm_ASMyZaxm_isee9lU1FZzJ-ZzgcHcBvUPYt3tJ-Fj74LjOApgCzLnOslFSTRS6MtQjV2XiA4g" },
      { id: "Entrance Decoration", desc: "Decorated entryways, welcome portals & arches.", img: "https://lh3.googleusercontent.com/aida/AEtjO1X14dj1Sxsc9Dj9k6N6eMOK56Wk86FlL-fiakOdjWoBjZAI122LhFLOqT9b_ZS8jzGJ3vEkD3LbashRbav-eTaao_ywBo8yvnIst4-4xhtkLbxX0t0uEcANOYR155EyxC4wVPiwOCpBF-fcfROZEMR_kgWFurWHRQU_C1pFapCWuosAOhUajWFq-BNahYrWNSgeU1nCsluw37LW1FipnaISD8uwJAJcDkfavjVXIBI_2UYaYn030V9YR58" },
      { id: "Lighting & Ambience", desc: "Festoon, ambient lighting & atmospheric design.", img: "https://lh3.googleusercontent.com/aida/AEtjO1VagbdKyImjk2JNLMYoJQ7B98SZIOOobb_DMYJ_50OylYZT_gFLz3IP9M7oelfu4GQ8PS5LDuBN9A7-0PjX0JNJLgjhIryeqb2WN4Pygn8aSD5zaIItgiPB8tY8Xz-No5Ds0In01_vU4oa_6DX-3kmm1L-VbRoeoujERqgWO0LS1_HtPmvaEZjMq2CKuUzlGkhnGU4Y218asMQhlNeaF3LfT9NfCrWKby9qn40v12t8_yVxzg1mVZmN-rfx" },
      { id: "Backdrop & Photo Area", desc: "Decorative photobooths and media walls.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdjdG5jSqnRTlcVYIzCTYTbf3hI7_fN1NTYgKdrW8uEHMsdA96-OdtumkIZEa7j62HNP3ZRvUQVN2mpJcXZn0bNYkoIxMM005ZNxaBWIISjZ1vjbJuTblOrnOVUN0kxPBF1s2NC43ZVkIa1qklZIbljGxoSbx0k7ZYzms7SJsIwvj5C_4tb-vzEldKTx9tV8e_V1CI6EtaZlYEK-5Z98aRPSIZyl9LeS6JbOWpw0sF04wbfngB-VOy3g" },
      { id: "Table & Seating Decoration", desc: "Table styling, centrepieces & coordinated seating.", img: "https://lh3.googleusercontent.com/aida/AEtjO1UtNG3G5ejt-1YD2f-vde7K_LebC1f7F73D1vHpTHENF43TpshkW1kR00UCXTsY3Z4OO3fpHAUAQfC0NY_0bEBPJWjdajeJjeIZkXdEO36cSGO7mb-tQPcFEzlbly910PpZ_-ULR9JpBcp2R4kJbmuvzabw-oJRiWaRRowjmspPdyb2QN_-mQQyBS-DNeGCwqu23QpK_qm4gTfgWAnyOx82R8uegKYSVUmZhywK8rk08YbQWM9q8umYBlpX" },
      { id: "Complete Venue Decoration", desc: "Comprehensive aesthetic transformation of venue.", img: "https://lh3.googleusercontent.com/aida/AEtjO1W_6G52tGP-Xwrne0CzxMu41UmveYtocAlMze5EdVPiP6HK_qP2TvGWXmLhC1fYhraDgFGtIm8QalF5SXMZETeKwl-AosWy_kam39HsXBX3Cp9SqkNQ9Tc1iiwUNhPoxhEKbO1_xC2TH1R6rNcStpTJEKRyv-VSOybn3RDRIf3A_GMIMpL7QV9_7s9AE8lU3TjgeVBoohe10m2apI16Mcd3ZY2da_p2_NyGHaFOLEDVLMmw1HulMd-466Be" }
    ]
  },
  entertainment: {
    title: "Entertainment",
    desc: "Choose the performances and entertainment that will create the right atmosphere.",
    items: [
      { id: "DJ & Music", desc: "DJ services, live console & sound arrangements.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDK8Opq-YmJsqn80AZ0TXgBS0Hh5FUFGgjZ_7lml3rI6lMfCjK4JJm5BzrcbuqYloH1av3_pK6ijcXf3AoH_Uv8eYsukjATVD5WZAv23J40UQu2cOHcWaRG6n_ppnanSEH9GvPyt-5PBlEro27D6NeF9DBjayROSOvGeLEo9PWj8xMtFHjdqx9QYeiDfqpiViO-pjhPyWI7R6OAf-5saOukYiSNm1IOMhab0NqAZ2jExCTvUZWN1CZRPQ" },
      { id: "Live Band", desc: "Live musicians, acoustic sets or full band.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuChxpPcHMeRTY1CKKRHzxTRrc0-CUK4VwbLx3TVAekKydAUx0eFXeBNRGypRYNABiy1p81SkDNoH1sczFXpIOrYbBfsszC3u8w9sQIQDl79QxCpt-c1-GkM-f0OEiuYl5vF5fAfZoTUtYDMjIA1SZdBRWugaLvHH4DS6-8vnCkwtBCsi_d2yq1_u4LxcebXTGoVrjq_qdZdVeNFPHvCJ-nQbLd24NcODhFInLtmsiEuN9wR7-giS_5w1Q" },
      { id: "Anchor / MC", desc: "Professional host & master of ceremonies.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-tuddyFv6WosWn3vGunnEkI6XqvR5cD8tmQkIElG3-74c5nH_3flAwALv_IF75OBMBJUHF2vRVD-EGg4WXGmFin3-j_Oc0VUfoI0EPfCimS82x7YZ105QiFt-F9MHhTPc-BsU8Twsyw0gZQ4qAB54L9f_QMSyh-bYnX63b8yMX2jG9kS4XpIR7fKLIFF27QgH4CRH3TzwoxCevLghuigVs69HZ_MqZRT-nXWUiCLXc_Ng2Az0VGm9uA" },
      { id: "Dance Performances", desc: "Professional troupe or choreographed acts.", img: "https://lh3.googleusercontent.com/aida/AEtjO1VagbdKyImjk2JNLMYoJQ7B98SZIOOobb_DMYJ_50OylYZT_gFLz3IP9M7oelfu4GQ8PS5LDuBN9A7-0PjX0JNJLgjhIryeqb2WN4Pygn8aSD5zaIItgiPB8tY8Xz-No5Ds0In01_vU4oa_6DX-3kmm1L-VbRoeoujERqgWO0LS1_HtPmvaEZjMq2CKuUzlGkhnGU4Y218asMQhlNeaF3LfT9NfCrWKby9qn40v12t8_yVxzg1mVZmN-rfx" }
    ]
  },
  media: {
    title: "Photography & Media",
    desc: "Choose the photography, video, and media services you want captured.",
    items: [
      { id: "Event Photography", desc: "Professional photographs throughout the event.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVDTd60kYrfO9XlSDRDyrgsHAcOYjC4kopF4n-t-DsSshZ-hMo62v2jk7PMWo8KSYKYU4pm_uknlROaomMLR8wQlR84tAs8ZpkJ8UEEx-PUKDYUQDTn0e8GtexWtAvVMTPP9mczNBHi083TQ0ljyFm8ushJeKA8LzM0e_CEY5Cjqs5a28UPpgvUyqS2jSpo7pQkwHVHtb8tIem7yH_TbNC_7Kzr89FAzE2yDCL8oAL5Ww7NlN5FuhNMQ" },
      { id: "Event Videography", desc: "Full high-definition video coverage of the event.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVDTd60kYrfO9XlSDRDyrgsHAcOYjC4kopF4n-t-DsSshZ-hMo62v2jk7PMWo8KSYKYU4pm_uknlROaomMLR8wQlR84tAs8ZpkJ8UEEx-PUKDYUQDTn0e8GtexWtAvVMTPP9mczNBHi083TQ0ljyFm8ushJeKA8LzM0e_CEY5Cjqs5a28UPpgvUyqS2jSpo7pQkwHVHtb8tIem7yH_TbNC_7Kzr89FAzE2yDCL8oAL5Ww7NlN5FuhNMQ" },
      { id: "Pre-event Shoot", desc: "Cinematic portraits & creative pre-wedding shoots.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhqS7CPu-HxXfLTlub7gcouk__-RvJqHhEHWHoyrWjHPsCmSYfMi4uKNhppkrzyj_1ktlwR7_WxXzVdw873Gc9vHqiyjWbrZbsjgXtTQzFkPT266pnGjtc2aPOFxI1Uqoq_VD_TAV5eiHAHJUTtH96pbwsLqbEH1fvWq7lm19-tbuqGH4itpcIuo7wTjarqKmsVGOWq3FcOPH7CRV0ykf6luMdCwzq200jYlZ6FNB13k_KG6JdJ7lptA" },
      { id: "Drone Coverage", desc: "Aerial 4K coverage, venue sweeps & arrivals.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiteSHL0_8hFEydMCG6lIF5Fml9L92V20LyKsrg58j01fXRqMyvBVUorkqHHVCJ4Ytxyw13TtmBdWTgIZ7Fao9zRPWqhDOkFTNm22u6sNl52rkUIwBmP8rjphtMoYV8HyG5WqxyJAIRHZlePeTl1ReUkZVv-A0ZpL2TOn3gIWtisX_UnkMbn4280oOH15dZAFsxHp9PMh2fQPYk51vcg6cF7Rs-scoEEae4d5gsvCjw1Cn7J0mxdniTw" },
      { id: "Cinematic Event Film", desc: "Color-graded cinematic highlight reel & trailer.", img: "https://lh3.googleusercontent.com/aida/AEtjO1W_6G52tGP-Xwrne0CzxMu41UmveYtocAlMze5EdVPiP6HK_qP2TvGWXmLhC1fYhraDgFGtIm8QalF5SXMZETeKwl-AosWy_kam39HsXBX3Cp9SqkNQ9Tc1iiwUNhPoxhEKbO1_xC2TH1R6rNcStpTJEKRyv-VSOybn3RDRIf3A_GMIMpL7QV9_7s9AE8lU3TjgeVBoohe10m2apI16Mcd3ZY2da_p2_NyGHaFOLEDVLMmw1HulMd-466Be" }
    ]
  },
  hospitality: {
    title: "Guest Services & Hospitality",
    desc: "Plan the arrangements that make your guests comfortable and your event run smoothly.",
    items: [
      { id: "Catering", desc: "Gourmet food & beverage curation for guests.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUO1jgqQM5RISEsjLj0IQ2z6jv4LDSdNHUQq6MKsaL_j1dGTnR9MORP6cps2VlErrgwKQgzjUazstyLAzLCohzDgh5UwXXIEqU28leWBNe0KQQTWqJaJEHyvmPSjC6lMVT8AIrCE-_MUfpUlS2zRmkCDcT8NVDZBsTXf2MsQe8qzcgJfZb1bX7cRl5cSAVcCg2uiCkyT0UK8w-3yyUvtOSP_aRpHoK9rflrz6ej2W60dP6WlMQ6uekww" },
      { id: "Transportation", desc: "Guest shuttles, transfers & bridal cars.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOLht6fZmGUYMp8v_iQPJ1RN0EoFY25FP9I_I7RdepY3wMkLZOxm2elLU35ErA4inumYtg3Pk_G03L-sMbWLK17WkTWAExuK57_N3zVKX-gzL9KBOvY45MSQD_ZespXBR_Et8YaSydFTuIob9uyCyE0vm-csOXgZ2cVo96lSb7wwceXIcqRxTAeo44eoN7p2_ZTRrXmAsCPWjGRJYTlDXcyDsd4gQgsysImSGuu1F4_8XtCMAzcV0A5A" }
    ]
  }
};

export const EventWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [themeColorHex, setThemeColorHex] = useState('#c54228');

  // Core Form State
  const [formData, setFormData] = useState({
    type: Object.keys(EVENT_WIZARD_CONFIG)[0],
    name: '',
    date: new Date().toISOString(),
    dateFlexibility: 'fixed',
    startTime: '16:00',
    endTime: '22:00',
    isOvernight: false,
    city: 'Chennai, Tamil Nadu',
    preferredArea: 'East Coast Road (ECR)',
    venueType: 'beach',
    venueStatus: 'not_yet',
    venueAddress: '',
    guestCount: '350',
    guestCertainty: 'estimating',
    guestRangeMin: 300,
    guestRangeMax: 400,
    eventScale: 'large',
    sessionComplexity: 'Multiple sessions at one location',
    budgetMin: '',
    budgetMax: '',
    budgetFlexibility: '',
    budgetTier: '',
    budgetIncludes: [] as string[],
    budgetNotes: '',
    services: {
      planning: [],
      decor: [],
      entertainment: [],
      media: [],
      hospitality: []
    } as Record<string, string[]>,
    servicePriorities: [] as string[],
    additionalNotes: '',
    style: '',
    colors: '',
    specialRequirements: '',
    referenceMedia: [] as File[],
    structuredAnswers: {} as Record<string, string | boolean>
  });

  // Calendar State & Logic
  const [calendarDate, setCalendarDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // 0 = Monday, 6 = Sunday for the UI grid
  };

  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const prevMonthDays = getDaysInMonth(calYear, calMonth - 1);
  
  const daysArray = [];
  for (let i = 0; i < firstDay; i++) {
    daysArray.push({ day: prevMonthDays - firstDay + i + 1, isCurrent: false, date: new Date(calYear, calMonth - 1, prevMonthDays - firstDay + i + 1) });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push({ day: i, isCurrent: true, date: new Date(calYear, calMonth, i) });
  }
  const remaining = (7 - (daysArray.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    daysArray.push({ day: i, isCurrent: false, date: new Date(calYear, calMonth + 1, i) });
  }

  const prevMonth = () => setCalendarDate(new Date(calYear, calMonth - 1, 1));
  const nextMonth = () => setCalendarDate(new Date(calYear, calMonth + 1, 1));
  const handleSelectDate = (d: Date) => {
    const userOffset = d.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(d.getTime() - userOffset);
    updateForm('date', adjustedDate.toISOString());
    setCalendarDate(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const isSelectedDate = (d: Date) => {
    if (!formData.date) return false;
    const selectedD = new Date(formData.date);
    return d.getFullYear() === selectedD.getFullYear() && d.getMonth() === selectedD.getMonth() && d.getDate() === selectedD.getDate();
  };

  const formatSeason = (dStr: string) => {
     if (!dStr) return "";
     const d = new Date(dStr);
     const m = d.getMonth();
     if (m >= 2 && m <= 4) return "Spring " + d.getFullYear();
     if (m >= 5 && m <= 7) return "Summer " + d.getFullYear();
     if (m >= 8 && m <= 10) return "Autumn " + d.getFullYear();
     return "Winter " + d.getFullYear();
  };
  
  const formatFullDate = (dStr: string) => {
     if (!dStr) return "";
     return new Date(dStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return "0.0 Hours";
    const [startH, startM] = formData.startTime.split(':').map(Number);
    const [endH, endM] = formData.endTime.split(':').map(Number);
    let durationMins = (endH * 60 + endM) - (startH * 60 + startM);
    if (formData.isOvernight) {
       durationMins += 24 * 60;
    } else if (durationMins < 0) {
       durationMins += 24 * 60;
    }
    return (durationMins / 60).toFixed(1) + " Hours";
  };

  const { user } = useAuth();

  const activeConfig = formData.type ? EVENT_WIZARD_CONFIG[formData.type] : null;

  const handleColorChange = (color: string) => {
    setThemeColorHex(color);
    try {
      const names = namer(color);
      const semanticName = names.ntc[0].name;
      updateForm('colors', semanticName);
    } catch (e) {
      // safe fallback
    }
  };

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleBudgetInclude = (item: string) => {
    if (item === 'all') {
      setFormData(prev => ({ ...prev, budgetIncludes: BUDGET_INCLUSIONS }));
      return;
    }
    setFormData(prev => {
      const current = prev.budgetIncludes;
      if (current.includes(item)) return { ...prev, budgetIncludes: current.filter(i => i !== item) };
      return { ...prev, budgetIncludes: [...current, item] };
    });
  };

  const handleGuestCountChange = (valStr: string) => {
    const val = parseInt(valStr);
    if (isNaN(val)) {
       updateForm('guestCount', valStr);
       return;
    }
    setFormData(prev => {
      const updates = { ...prev, guestCount: valStr };
      if (val >= 100) {
        updates.guestRangeMin = Math.max(10, Math.round(val * 0.85 / 10) * 10);
        updates.guestRangeMax = Math.round(val * 1.15 / 10) * 10;
      } else {
        updates.guestRangeMin = val;
        updates.guestRangeMax = val;
      }
      return updates;
    });
  };

  const updateStructuredAnswer = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      structuredAnswers: { ...prev.structuredAnswers, [key]: value }
    }));
  };

  const toggleService = (category: string, serviceId: string) => {
    setFormData(prev => {
      const catList = prev.services[category] || [];
      const newCatList = catList.includes(serviceId)
        ? catList.filter(s => s !== serviceId)
        : [...catList, serviceId];
      
      const newServices = { ...prev.services, [category]: newCatList };
      
      let newPriorities = [...prev.servicePriorities];
      if (!newCatList.includes(serviceId)) {
         newPriorities = newPriorities.filter(p => p !== serviceId);
      }
      
      return { ...prev, services: newServices, servicePriorities: newPriorities };
    });
  };

  const togglePriority = (serviceId: string) => {
    setFormData(prev => {
      let newPriorities = [...prev.servicePriorities];
      if (newPriorities.includes(serviceId)) {
        newPriorities = newPriorities.filter(p => p !== serviceId);
      } else if (newPriorities.length < 3) {
        newPriorities.push(serviceId);
      }
      return { ...prev, servicePriorities: newPriorities };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFormData(prev => ({
        ...prev,
        referenceMedia: [selectedFile]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      referenceMedia: prev.referenceMedia.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.type) {
      alert("Please select an event type to continue.");
      return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
    else navigate('/client');
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      const { data: eventType } = await supabase
        .from('event_types')
        .select('id')
        .eq('name', formData.type)
        .single();
      
      if (!eventType) throw new Error("Event type not found in database.");

      let mappedVenueStatus = null;
      if (formData.venueStatus === 'booked') mappedVenueStatus = 'selected';
      if (formData.venueStatus === 'not_yet' || formData.venueStatus === 'need_help') mappedVenueStatus = 'not_selected';

      // 2. Upload Files to Supabase Storage
      const uploadedPaths: string[] = [];
      for (const file of formData.referenceMedia) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('client-event-media')
          .upload(filePath, file);
        
        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(`Failed to upload ${file.name}`);
        }
        uploadedPaths.push(filePath);
      }

      // 3. Create Payload
      const payload = {
        client_id: user.id,
        event_type_id: eventType.id,
        name: formData.name,
        event_date: formData.date || new Date().toISOString(),
        city: formData.city,
        venue: formData.venueStatus === 'selected' ? 'Selected Venue' : null,
        venue_status: mappedVenueStatus,
        venue_address: formData.venueAddress,
        guest_count: parseInt(formData.guestCount) || 1,
        budget_min: formData.budgetMin ? parseFloat(formData.budgetMin) : null,
        budget_max: parseFloat(formData.budgetMax) || null,
        budget_flexibility: formData.budgetFlexibility || 'not_sure',
        services: Object.values(formData.services).flat(),
        reference_media: uploadedPaths,
        requirements: {
          special: formData.specialRequirements,
          additionalNotes: formData.additionalNotes,
          servicePriorities: formData.servicePriorities,
          budgetIncludes: formData.budgetIncludes,
          budgetNotes: formData.budgetNotes,
          budgetTier: formData.budgetTier,
          ...formData.structuredAnswers
        },
        style_preferences: {
          style: formData.style,
          colors: formData.colors || 'Terracotta',
          color_hex: themeColorHex
        },
        status: 'open'
      };

      const { error } = await supabase.from('events').insert(payload);
      if (error) throw error;
      
      navigate('/client/events');
    } catch (err: any) {
      console.error("Submission Error:", err);
      alert("Failed to save event. Did you run the SQL update script?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Header & Progress */}
      <div className="mb-10">
        <button 
          onClick={handleBack}
          className="flex items-center text-sm font-medium text-celebrate-navy/60 hover:text-celebrate-navy mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep === 1 ? 'Cancel & Return' : 'Back'}
        </button>

        <h1 className="font-serif text-4xl text-celebrate-navy mb-8">Plan your celebration</h1>
        
        {/* Progress Tracker */}
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-celebrate-navy/10 -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-celebrate-terracotta transition-all duration-300 -z-10"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          ></div>
          
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isCompleted 
                      ? 'bg-celebrate-terracotta text-white border-2 border-white' 
                      : isCurrent 
                        ? 'bg-celebrate-navy text-white border-2 border-white' 
                        : 'bg-white text-celebrate-navy/40 border-2 border-celebrate-navy/10'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={`mt-2 text-xs font-medium hidden sm:block ${isCurrent ? 'text-celebrate-navy' : 'text-celebrate-navy/50'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-celebrate-navy/5 min-h-[400px] flex flex-col">
        
        <div className="flex-1">
          {/* STEP 1: EVENT DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-serif text-celebrate-navy">Event Details</h2>
              <p className="text-celebrate-navy/70">Let's start with the basics.</p>
              
              <div className="mt-8 space-y-8">
                <div className="flex flex-col items-center">
                  <EventCarousel 
                    eventTypes={Object.keys(EVENT_WIZARD_CONFIG)}
                    selectedType={formData.type}
                    onSelect={(t) => updateForm('type', t)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-celebrate-navy mb-2">Name your event *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    placeholder="e.g. Ananya & Arjun Wedding"
                    className="w-full px-4 py-3 rounded-xl border border-celebrate-navy/20 focus:border-celebrate-navy focus:ring-1 focus:ring-celebrate-navy outline-none transition-all"
                  />
                </div>
                

              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIMING */}
          {currentStep === 2 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex flex-col w-full pb-10 text-[#221b0a]">
                 <header className="mt-3 mb-6">
                   <h1 className="font-serif text-[28px] leading-[36px] tracking-tight font-normal text-[#00142a]">
                     When is your event?
                   </h1>
                   <p className="mt-2 text-[15px] leading-relaxed text-[#43474d]">
                     Choose your preferred date and timing. We’ll use this information to find planners who can accommodate your schedule.
                   </p>
                 </header>
                 
                 <section className="mb-8">
                   <div className="flex items-center justify-between mb-2.5">
                     <label className="text-[11px] font-semibold text-[#805533] tracking-wider uppercase flex items-center gap-1.5">
                       <span className="material-symbols-outlined text-[15px] text-[#805533]">calendar_today</span>
                       Preferred Event Date
                     </label>
                     <span className="text-[12px] text-[#43474d]/80">{formatSeason(formData.date)}</span>
                   </div>
                   
                   <div className="w-full bg-white p-3.5 rounded-xl shadow-sm mb-3 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-[#fbecd1] flex flex-col items-center justify-center text-[#00142a]">
                         <span className="text-[9px] uppercase tracking-wider text-[#805533] font-semibold">{formData.date ? new Date(formData.date).toLocaleDateString('en-US', {month: 'short'}) : ''}</span>
                         <span className="text-[20px] leading-none font-medium">{formData.date ? new Date(formData.date).getDate() : ''}</span>
                       </div>
                       <div>
                         <div className="text-[16px] text-[#00142a] font-normal font-serif">{formatFullDate(formData.date)}</div>
                         <div className="text-[12px] text-[#43474d]">Recommended 6-month planning buffer</div>
                       </div>
                     </div>
                     <span className="material-symbols-outlined text-[#805533] text-[20px]">edit_calendar</span>
                   </div>
                   
                   <div className="w-full bg-white p-4 rounded-xl shadow-sm">
                     <div className="flex items-center justify-between pb-3">
                       <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-[#fff2dd] flex items-center justify-center text-[#00142a] hover:bg-[#fbecd1] transition-all" type="button">
                         <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                       </button>
                       <div className="text-center">
                         <span className="text-[16px] text-[#00142a] font-normal font-serif">
                           {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                         </span>
                       </div>
                       <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-[#fff2dd] flex items-center justify-center text-[#00142a] hover:bg-[#fbecd1] transition-all" type="button">
                         <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                       </button>
                     </div>
                     
                     <div className="grid grid-cols-7 text-center py-2 text-[#43474d] text-[11px] font-semibold opacity-75">
                       <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
                     </div>
                     
                     <div className="grid grid-cols-7 gap-y-1 text-center text-[13px] pt-1">
                       {daysArray.map((d, i) => (
                         <div 
                           key={i} 
                           onClick={() => handleSelectDate(d.date)}
                           className={
                             isSelectedDate(d.date)
                               ? "flex items-center justify-center py-1 cursor-pointer"
                               : `py-1.5 rounded-full cursor-pointer transition-colors ${d.isCurrent ? 'text-[#00142a] hover:bg-[#fbecd1]' : 'text-[#43474d]/30 select-none'}`
                           }
                         >
                           {isSelectedDate(d.date) ? (
                             <span className="w-8 h-8 rounded-full bg-[#0a2947] text-white flex items-center justify-center font-medium shadow-sm ring-2 ring-[#0a2947]/20">
                               {d.day}
                             </span>
                           ) : (
                             d.day
                           )}
                         </div>
                       ))}
                     </div>
                     
                     <div className="mt-3 pt-3 flex items-center justify-between text-[#43474d]">
                       <div className="flex items-center gap-1.5">
                         <span className="w-2 h-2 rounded-full bg-[#0a2947]"></span>
                         <span className="text-[12px]">Target Date</span>
                       </div>
                       <span className="text-[12px] text-[#805533] font-medium">Saturday slot (high demand)</span>
                     </div>
                   </div>
                 </section>

                 <section className="mb-8">
                   <div className="mb-3">
                     <h2 className="text-[20px] text-[#00142a] font-normal font-serif">How flexible is your date?</h2>
                     <p className="text-[13px] text-[#43474d] mt-0.5">This helps us find suitable planners if your preferred date is unavailable.</p>
                   </div>
                   
                   <div className="flex flex-col gap-2.5">
                     <label className={`flex items-start justify-between p-3.5 rounded-xl bg-white cursor-pointer transition-all hover:bg-[#fff2dd] shadow-sm ${formData.dateFlexibility === 'fixed' ? 'ring-1 ring-[#0a2947]/20' : ''}`}>
                       <div className="flex items-start gap-3">
                         <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${formData.dateFlexibility === 'fixed' ? 'bg-[#0a2947]' : 'bg-[#f6e6cb]'}`}>
                           <span className={`w-1.5 h-1.5 rounded-full ${formData.dateFlexibility === 'fixed' ? 'bg-white' : 'bg-transparent'}`}></span>
                         </div>
                         <div>
                           <div className="text-[14px] text-[#00142a] font-medium">Fixed date</div>
                           <div className="text-[13px] text-[#43474d]">My event must happen on this specific date.</div>
                         </div>
                       </div>
                       <input 
                         className="sr-only" 
                         name="flexibility" 
                         type="radio" 
                         value="fixed" 
                         checked={formData.dateFlexibility === 'fixed'}
                         onChange={() => updateForm('dateFlexibility', 'fixed')}
                       />
                     </label>

                     <label className={`flex items-start justify-between p-3.5 rounded-xl bg-white cursor-pointer transition-all hover:bg-[#fff2dd] shadow-sm ${formData.dateFlexibility === 'open' ? 'ring-1 ring-[#0a2947]/20' : ''}`}>
                       <div className="flex items-start gap-3">
                         <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${formData.dateFlexibility === 'open' ? 'bg-[#0a2947]' : 'bg-[#f6e6cb]'}`}>
                           <span className={`w-1.5 h-1.5 rounded-full ${formData.dateFlexibility === 'open' ? 'bg-white' : 'bg-transparent'}`}></span>
                         </div>
                         <div>
                           <div className="text-[14px] text-[#00142a] font-medium">Completely flexible dates</div>
                           <div className="text-[13px] text-[#43474d]">I’m open to discussing the best available date with the planner.</div>
                         </div>
                       </div>
                       <input 
                         className="sr-only" 
                         name="flexibility" 
                         type="radio" 
                         value="open"
                         checked={formData.dateFlexibility === 'open'}
                         onChange={() => updateForm('dateFlexibility', 'open')}
                       />
                     </label>
                   </div>
                 </section>

                 <section className="mb-8">
                   <div className="mb-3">
                     <h2 className="text-[20px] text-[#00142a] font-normal font-serif">What time will your event take place?</h2>
                     <p className="text-[13px] text-[#43474d] mt-0.5">Approximate timings are fine if your schedule isn’t finalized yet.</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-2.5 mb-3">
                     <div className="bg-white p-3.5 rounded-xl shadow-sm relative">
                       <label className="block text-[11px] font-semibold text-[#805533] uppercase tracking-wider mb-1.5">Start Time</label>
                       <div className="flex items-center justify-between">
                         <input 
                           type="time" 
                           value={formData.startTime}
                           onChange={(e) => updateForm('startTime', e.target.value)}
                           className="text-[16px] text-[#00142a] font-serif bg-transparent outline-none w-full cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full"
                         />
                         <span className="material-symbols-outlined text-[#43474d] text-[18px] pointer-events-none">schedule</span>
                       </div>
                       <span className="text-[11px] text-[#43474d]/80 block mt-1">Arrival & welcome</span>
                     </div>
                     <div className="bg-white p-3.5 rounded-xl shadow-sm relative">
                       <label className="block text-[11px] font-semibold text-[#805533] uppercase tracking-wider mb-1.5">End Time</label>
                       <div className="flex items-center justify-between">
                         <input 
                           type="time" 
                           value={formData.endTime}
                           onChange={(e) => updateForm('endTime', e.target.value)}
                           className="text-[16px] text-[#00142a] font-serif bg-transparent outline-none w-full cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full"
                         />
                         <span className="material-symbols-outlined text-[#43474d] text-[18px] pointer-events-none">nightlight</span>
                       </div>
                       <span className="text-[11px] text-[#43474d]/80 block mt-1">Reception conclusion</span>
                     </div>
                   </div>

                   <label className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm cursor-pointer mb-3">
                     <div className="flex items-center gap-2.5">
                       <span className="material-symbols-outlined text-[#805533] text-[20px]">bedtime</span>
                       <div>
                         <span className="text-[13px] text-[#00142a] font-medium block">Ends the following day</span>
                         <span className="text-[12px] text-[#43474d]">For overnight galas, retreats, or weekend stays</span>
                       </div>
                     </div>
                     <div className="relative inline-flex items-center">
                       <input 
                         className="sr-only peer" 
                         type="checkbox"
                         checked={formData.isOvernight}
                         onChange={(e) => updateForm('isOvernight', e.target.checked)}
                       />
                       <div className="w-9 h-5 bg-[#f6e6cb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0a2947]"></div>
                     </div>
                   </label>

                   <div className="p-3 bg-[#fff2dd] rounded-xl flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-[#805533]/15 flex items-center justify-center text-[#805533]">
                         <span className="material-symbols-outlined text-[15px]">timelapse</span>
                       </div>
                       <span className="text-[13px] text-[#00142a] font-medium">Estimated event duration:</span>
                     </div>
                     <span className="text-[14px] font-medium text-[#805533] bg-white px-2.5 py-1 rounded-full shadow-sm">{calculateDuration()}</span>
                   </div>
                 </section>

                 <section className="mb-8">
                   <div className="bg-[#fff2dd] p-4 rounded-xl flex items-start gap-3 shadow-sm">
                     <div className="w-8 h-8 rounded-full bg-[#ffdcc5] flex items-center justify-center shrink-0 text-[#301400]">
                       <span className="material-symbols-outlined text-[18px]">verified</span>
                     </div>
                     <div>
                       <div className="text-[16px] text-[#00142a] font-normal font-serif leading-snug">Planner Availability Guarantee</div>
                       <p className="text-[13px] text-[#43474d] mt-1 leading-relaxed">
                         We cross-reference every planner’s calendar in real time to verify that matched candidates have dedicated capacity and staff for your chosen date window.
                       </p>
                     </div>
                   </div>
                 </section>
               </div>
             </div>
          )}

          {/* STEP 3: LOCATION & VENUE */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col w-full pb-6 space-y-7 text-[#221b0a]">
                <header className="flex flex-col space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-[#fdc39a]/30 text-[#805533]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#805533]"></span>
                    <span className="text-[11px] font-semibold tracking-widest uppercase">Location & Venue</span>
                  </div>
                  <h1 className="font-serif text-[28px] leading-[36px] text-[#00142a] tracking-tight">
                    Where is your event happening?
                  </h1>
                  <p className="text-[15px] text-[#43474d] leading-relaxed">
                    Tell us where you're planning your event so we can find planners who serve your location and understand your venue requirements.
                  </p>
                </header>

                <section className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] uppercase text-[#00142a] font-semibold tracking-wider flex items-center gap-1">
                      <span>Which city will host your event?</span>
                      <span className="text-[#805533]">*</span>
                    </label>
                    <span className="text-[12px] text-[#43474d]">Planners will be filtered to those with verified local execution networks in this region.</span>
                  </div>
                  
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center pointer-events-none text-[#805533]">
                      <span className="material-symbols-outlined text-[20px]">location_on</span>
                    </div>
                    <input 
                      type="text" 
                      value={formData.city} 
                      onChange={(e) => updateForm('city', e.target.value)}
                      className="w-full h-12 pl-11 pr-11 bg-white text-[#00142a] text-[15px] rounded-lg shadow-sm focus:outline-none"
                    />
                    <div className="absolute right-3.5 flex items-center text-[#00142a]">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto py-0.5" style={{ scrollbarWidth: 'none' }}>
                    {CITIES.map(c => (
                      <button 
                        key={c}
                        type="button" 
                        onClick={() => updateForm('city', c)}
                        className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${formData.city.includes(c) ? 'bg-[#00142a] text-white shadow-sm' : 'bg-[#f6e6cb]/60 text-[#00142a] hover:bg-[#f6e6cb]'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] uppercase text-[#00142a] font-semibold tracking-wider">
                        Preferred area or locality
                      </label>
                      <span className="text-[12px] text-[#43474d]">Optional</span>
                    </div>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center pointer-events-none text-[#43474d]">
                        <span className="material-symbols-outlined text-[19px]">explore</span>
                      </div>
                      <input 
                        type="text" 
                        value={formData.preferredArea}
                        onChange={(e) => updateForm('preferredArea', e.target.value)}
                        placeholder="e.g. Anna Nagar, OMR, ECR, T. Nagar or nearby landmark" 
                        className="w-full h-12 pl-11 pr-4 bg-white text-[#00142a] text-[15px] rounded-lg shadow-sm focus:outline-none"
                      />
                    </div>
                    <span className="text-[12px] text-[#43474d]">Helps us narrow down planners with specific venue relationships in this zone.</span>
                  </div>
                </section>

                <section className="flex flex-col space-y-3.5">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] uppercase text-[#00142a] font-semibold tracking-wider flex items-center gap-1">
                      <span>What type of venue are you planning to use?</span>
                      <span className="text-[#805533]">*</span>
                    </label>
                    <span className="text-[12px] text-[#43474d]">Explore the venue styles below and select the one that best matches your event.</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {VENUE_TYPES.map(vt => {
                      const isSelected = formData.venueType === vt.id;
                      return (
                        <button 
                          key={vt.id}
                          type="button" 
                          onClick={() => updateForm('venueType', vt.id)}
                          className={`flex flex-col items-start overflow-hidden rounded-xl bg-white text-left transition-all group relative ${isSelected ? 'border-2 border-[#0a2947] shadow-sm' : 'border border-[#c3c6ce]/30 hover:border-[#c3c6ce] shadow-sm'} ${vt.colSpan ? 'col-span-2 sm:col-span-1' : ''}`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-[#00142a] flex items-center justify-center text-white shadow-sm">
                              <span className="material-symbols-outlined text-[15px]">check</span>
                            </div>
                          )}
                          <div className="w-full aspect-[4/3] overflow-hidden bg-[#f6e6cb] relative">
                            <img src={vt.img} alt={vt.label} className={`w-full h-full object-cover transition-transform duration-300 ${isSelected ? '' : 'group-hover:scale-105'}`} />
                          </div>
                          <div className={`p-3 flex flex-col w-full ${isSelected ? 'bg-[#fff2dd]/60' : ''}`}>
                            <div className="flex items-center justify-between">
                              <span className={`font-serif text-[15px] leading-snug ${isSelected ? 'text-[#00142a] font-semibold' : 'text-[#00142a] font-normal'}`}>{vt.label}</span>
                              {isSelected && <span className="text-[10px] uppercase text-[#805533] font-semibold">Selected</span>}
                            </div>
                            <span className="text-[12px] text-[#43474d] mt-1 line-clamp-2 leading-tight">{vt.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {['beach', 'outdoor'].includes(formData.venueType) && (
                    <div className="p-3.5 rounded-lg bg-[#f6e6cb]/50 flex items-start gap-2.5 animate-in fade-in duration-300">
                      <span className="material-symbols-outlined text-[20px] text-[#805533] shrink-0 mt-0.5">wb_sunny</span>
                      <p className="text-[13px] text-[#221b0a] leading-snug">
                        <strong className="font-medium text-[#00142a]">Coastal & Outdoor selected:</strong> Planners with dedicated weather contingencies and specialized canopy structures will be prioritized.
                      </p>
                    </div>
                  )}
                </section>

                <section className="flex flex-col space-y-3">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] uppercase text-[#00142a] font-semibold tracking-wider flex items-center gap-1">
                      <span>Have you already booked your venue?</span>
                      <span className="text-[#805533]">*</span>
                    </label>
                    <span className="text-[12px] text-[#43474d]">Indicate your confirmation status for site management.</span>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <div className={`flex flex-col rounded-lg transition-colors overflow-hidden ${formData.venueStatus === 'booked' ? 'bg-[#fff2dd] shadow-sm' : 'bg-white hover:bg-[#f6e6cb]/30'}`}>
                      <div onClick={() => updateForm('venueStatus', 'booked')} className="flex items-start gap-3 p-3.5 cursor-pointer">
                        <div className="pt-0.5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.venueStatus === 'booked' ? 'bg-[#00142a]' : 'bg-[#f6e6cb]'}`}>
                            {formData.venueStatus === 'booked' && <div className="w-1.5 h-1.5 rounded-full bg-[#fff2dd]"></div>}
                          </div>
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className={`text-[14px] ${formData.venueStatus === 'booked' ? 'text-[#00142a] font-semibold' : 'text-[#00142a] font-medium'}`}>Yes, venue booked</span>
                          <span className="text-[12px] text-[#43474d]">I have confirmed and paid for my event venue.</span>
                        </div>
                      </div>
                      
                      {formData.venueStatus === 'booked' && (
                        <div className="px-10 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#00142a]">
                              Venue Name or Address
                            </label>
                            <input 
                              type="text" 
                              value={formData.venueAddress} 
                              onChange={(e) => updateForm('venueAddress', e.target.value)}
                              placeholder="e.g. ITC Grand Chola, Guindy"
                              className="w-full px-3 py-2.5 bg-white text-[#00142a] text-[14px] rounded-lg border border-[#fbecd1] focus:border-[#00142a] focus:outline-none shadow-sm transition-colors"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div onClick={() => updateForm('venueStatus', 'not_yet')} className={`flex items-start gap-3 p-3.5 rounded-lg cursor-pointer transition-colors ${formData.venueStatus === 'not_yet' ? 'bg-[#fff2dd] shadow-sm' : 'bg-white hover:bg-[#f6e6cb]/30'}`}>
                      <div className="pt-0.5">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.venueStatus === 'not_yet' ? 'bg-[#00142a]' : 'bg-[#f6e6cb]'}`}>
                          {formData.venueStatus === 'not_yet' && <div className="w-1.5 h-1.5 rounded-full bg-[#fff2dd]"></div>}
                        </div>
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[14px] ${formData.venueStatus === 'not_yet' ? 'text-[#00142a] font-semibold' : 'text-[#00142a] font-medium'}`}>Not yet</span>
                          <span className="text-[12px] text-[#805533] font-medium">Recommended for Planners</span>
                        </div>
                        <span className="text-[12px] text-[#43474d]">I know the type of venue I want, but haven't booked one.</span>
                      </div>
                    </div>

                    <div onClick={() => updateForm('venueStatus', 'need_help')} className={`flex items-start gap-3 p-3.5 rounded-lg cursor-pointer transition-colors ${formData.venueStatus === 'need_help' ? 'bg-[#fff2dd] shadow-sm' : 'bg-white hover:bg-[#f6e6cb]/30'}`}>
                      <div className="pt-0.5">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.venueStatus === 'need_help' ? 'bg-[#00142a]' : 'bg-[#f6e6cb]'}`}>
                          {formData.venueStatus === 'need_help' && <div className="w-1.5 h-1.5 rounded-full bg-[#fff2dd]"></div>}
                        </div>
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[14px] ${formData.venueStatus === 'need_help' ? 'text-[#00142a] font-semibold' : 'text-[#00142a] font-medium'}`}>Need help finding a venue</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#fdc39a]/40 text-[#794e2e] text-[10px] tracking-wider uppercase font-semibold">Sourcing Included</span>
                        </div>
                        <span className="text-[12px] text-[#43474d]">I would like support identifying, inspecting, and securing a suitable venue.</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="p-4 rounded-lg bg-[#f6e6cb]/40 flex flex-col space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b-0">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#805533]">pin_drop</span>
                      <h3 className="font-serif text-[16px] text-[#00142a] font-medium">Your Location Summary</h3>
                    </div>
                    <span className="text-[11px] uppercase text-[#805533] font-semibold">Step 3 Verified</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-[12px] text-[#43474d]">Target City</span>
                      <span className="text-[13px] text-[#00142a] font-medium">{formData.city || '-'}</span>
                    </div>
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-[12px] text-[#43474d]">Locality / Zone</span>
                      <span className="text-[13px] text-[#00142a] font-medium">{formData.preferredArea || '-'}</span>
                    </div>
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-[12px] text-[#43474d]">Venue Typology</span>
                      <span className="text-[13px] text-[#00142a] font-medium">{VENUE_TYPES.find(v => v.id === formData.venueType)?.label || '-'}</span>
                    </div>
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-[12px] text-[#43474d]">Booking Status</span>
                      <span className="text-[13px] text-[#805533] font-medium">{formData.venueStatus === 'booked' ? 'Confirmed' : 'Awaiting Planner Match'}</span>
                    </div>
                  </div>
                </section>

                <section className="p-4 rounded-lg bg-white flex items-start gap-3.5 shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-[#fdc39a]/40 flex items-center justify-center shrink-0 text-[#805533]">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <h4 className="text-[14px] text-[#00142a] font-semibold">Regional Coverage Guarantee</h4>
                    <p className="text-[12px] text-[#43474d] leading-relaxed">
                      Celebrate matches only planners who maintain active vendor networks and hold verified venue access permits across {formData.city || 'the region'} {formData.preferredArea ? `and the ${formData.preferredArea} belt` : ''}.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* STEP 4: GUEST COUNT & SCALE */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col w-full pb-10 text-[#221b0a]">
                <header className="flex flex-col gap-1.5 mt-4 mb-7">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#fdc39a]/40 text-[#794e2e] text-[11px] font-semibold tracking-widest uppercase">
                      Guest Count & Scale
                    </span>
                    <span className="inline-flex items-center gap-1 text-[12px] text-[#805533]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#805533]"></span>
                      Curated Capacity
                    </span>
                  </div>
                  <h1 className="font-serif text-[28px] leading-[36px] text-[#00142a] mt-1 tracking-tight">
                    How many guests are you expecting?
                  </h1>
                  <p className="text-[15px] text-[#43474d] max-w-prose">
                    Your guest count helps us match bespoke planners with verified experience, operational team size, and tailored culinary capabilities.
                  </p>
                </header>

                <section className="flex flex-col gap-2 mb-12">
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-[#00142a] font-semibold">
                      Expected Number of Guests *
                    </span>
                    <span className="text-[12px] text-[#43474d] mt-0.5">
                      An approximate estimate is fine. You can refine this with your chosen planner.
                    </span>
                  </div>

                  <div className="w-full bg-white rounded-xl p-7 flex flex-col items-center justify-center shadow-sm">
                    <div className="flex items-center justify-between w-full max-w-xs px-2">
                      <button 
                        type="button" 
                        onClick={() => {
                          const cur = parseInt(formData.guestCount) || 10;
                          handleGuestCountChange(Math.max(10, cur - 25).toString());
                        }}
                        className="w-12 h-12 rounded-full bg-[#fff2dd] hover:bg-[#fbecd1] text-[#00142a] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[24px]">remove</span>
                      </button>
                      
                      <div className="flex flex-col items-center text-center select-none">
                        <div className="relative inline-flex items-baseline">
                          <input 
                            type="number" 
                            value={formData.guestCount}
                            onChange={(e) => handleGuestCountChange(e.target.value)}
                            className="w-32 bg-transparent text-center font-serif text-[38px] leading-[44px] text-[#00142a] focus:outline-none p-0 tracking-tight"
                          />
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#805533] mt-1">
                          Confirmed Attendees
                        </span>
                      </div>
                      
                      <button 
                        type="button" 
                        onClick={() => {
                          const cur = parseInt(formData.guestCount) || 10;
                          handleGuestCountChange((cur + 25).toString());
                        }}
                        className="w-12 h-12 rounded-full bg-[#00142a] text-white hover:bg-[#00142a]/90 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[24px]">add</span>
                      </button>
                    </div>
                    
                    <div className="w-full pt-7 mt-4 flex flex-col items-center">
                      <span className="text-[12px] text-[#43474d] mb-2 text-center">
                        Quick baseline presets
                      </span>
                      <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                        {[50, 150, 250, 350, 500, 750].map(val => (
                          <button 
                            key={val}
                            type="button" 
                            onClick={() => handleGuestCountChange(val.toString())}
                            className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium transition-colors ${parseInt(formData.guestCount) === val ? 'bg-[#00142a] text-white' : 'bg-[#fff2dd] text-[#221b0a] hover:bg-[#fbecd1]'}`}
                          >
                            {val}{val === 750 ? '+' : ''}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 mt-4 text-[#43474d]">
                      <span className="material-symbols-outlined text-[15px] text-[#805533]">tune</span>
                      <span className="text-[12px]">Direct numeric input supported · Minimum threshold 10</span>
                    </div>
                  </div>
                </section>

                <section className="flex flex-col gap-2 mb-12">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#00142a]">
                      How certain is your guest count?
                    </span>
                    <span className="text-[12px] text-[#43474d] mt-0.5">
                      Provides flexibility in vendor staffing proposals and seating charts.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div onClick={() => updateForm('guestCertainty', 'certain')} className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${formData.guestCertainty === 'certain' ? 'bg-[#fff2dd]' : 'bg-white'}`}>
                      <div className="pt-0.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${formData.guestCertainty === 'certain' ? 'bg-[#00142a] text-white' : 'bg-[#f6e6cb]'}`}>
                          {formData.guestCertainty === 'certain' ? <span className="material-symbols-outlined text-[14px]">check</span> : <div className="w-2 h-2 rounded-full bg-transparent"></div>}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-serif text-[16px] text-[#00142a] font-medium">Fairly certain</span>
                        <span className="text-[13px] text-[#43474d] mt-0.5">
                          I have a refined guest list and expect very little variance.
                        </span>
                      </div>
                    </div>

                    <div onClick={() => updateForm('guestCertainty', 'estimating')} className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${formData.guestCertainty === 'estimating' ? 'bg-[#fff2dd]' : 'bg-white'}`}>
                      <div className="pt-0.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${formData.guestCertainty === 'estimating' ? 'bg-[#00142a] text-white' : 'bg-[#f6e6cb]'}`}>
                          {formData.guestCertainty === 'estimating' ? <span className="material-symbols-outlined text-[14px]">check</span> : <div className="w-2 h-2 rounded-full bg-transparent"></div>}
                        </div>
                      </div>
                      <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-[16px] text-[#00142a] font-medium">Still estimating</span>
                          <span className="text-[11px] font-semibold text-[#805533] bg-[#fbecd1] px-2 py-0.5 rounded uppercase tracking-wider">RECOMMENDED</span>
                        </div>
                        <span className="text-[13px] text-[#43474d] mt-0.5">
                          Invitations are not yet out; final attendance numbers may fluctuate.
                        </span>
                      </div>
                    </div>
                  </div>

                  {formData.guestCertainty === 'estimating' && (
                    <div className="w-full bg-[#fbecd1] rounded-xl p-4 flex flex-col gap-2 mt-1 animate-in fade-in duration-300">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#805533] text-[18px]">straighten</span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#805533]">
                          Estimated Guest Range (Optional)
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col bg-white rounded-lg p-2">
                          <label className="text-[11px] font-semibold text-[#43474d] uppercase">Min Attendees</label>
                          <div className="flex items-baseline gap-1 mt-1">
                            <input 
                              type="number" 
                              value={formData.guestRangeMin} 
                              onChange={(e) => updateForm('guestRangeMin', parseInt(e.target.value) || 0)} 
                              className="w-full bg-transparent font-serif text-[16px] text-[#00142a] focus:outline-none" 
                            />
                            <span className="text-[12px] text-[#43474d]">ppl</span>
                          </div>
                        </div>
                        <div className="flex flex-col bg-white rounded-lg p-2">
                          <label className="text-[11px] font-semibold text-[#43474d] uppercase">Max Capacity</label>
                          <div className="flex items-baseline gap-1 mt-1">
                            <input 
                              type="number" 
                              value={formData.guestRangeMax} 
                              onChange={(e) => updateForm('guestRangeMax', parseInt(e.target.value) || 0)} 
                              className="w-full bg-transparent font-serif text-[16px] text-[#00142a] focus:outline-none" 
                            />
                            <span className="text-[12px] text-[#43474d]">ppl</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[12px] text-[#43474d]">
                        Informs planners to request tier-based modular staging and variable catering minimums without penalties.
                      </p>
                    </div>
                  )}
                </section>

                <section className="flex flex-col gap-2 mb-12">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#00142a]">
                      How big is your celebration? *
                    </span>
                    <span className="text-[12px] text-[#43474d] mt-0.5">
                      Helps calibrate the required production scale and on-site event crew.
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'intimate', icon: 'spa', title: 'Intimate', desc: 'Personal gathering for close family and inner circle.' },
                      { id: 'small', icon: 'wine_bar', title: 'Small', desc: 'Curated and relaxed with an intentional, focused guest count.' },
                      { id: 'large', icon: 'domain', title: 'Large', desc: 'A substantial event requiring synchronized logistics and multiple vendors.' },
                      { id: 'grand', icon: 'festival', title: 'Grand', desc: 'High production requiring extensive stage infrastructure and full crews.' }
                    ].map(scale => {
                      const isSelected = formData.eventScale === scale.id;
                      return (
                        <div 
                          key={scale.id}
                          onClick={() => updateForm('eventScale', scale.id)}
                          className={`flex flex-col justify-between p-4 rounded-xl cursor-pointer transition-all min-h-[160px] ${isSelected ? 'bg-[#00142a] text-white shadow-sm' : 'bg-white hover:bg-[#fff2dd]'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#fff2dd]/20 text-[#fdc39a]' : 'bg-[#fbecd1] text-[#805533]'}`}>
                              <span className="material-symbols-outlined text-[20px]">{scale.icon}</span>
                            </div>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full bg-[#fdc39a] text-[#301400] text-[11px] font-semibold uppercase tracking-wider">
                                SELECTED
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col mt-2">
                            <span className={`font-serif text-[16px] font-medium ${isSelected ? 'text-white' : 'text-[#00142a]'}`}>{scale.title}</span>
                            <span className={`text-[13px] line-clamp-2 mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#43474d]'}`}>
                              {scale.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="flex flex-col gap-2 mb-12">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#00142a]">
                      Will your event involve multiple sessions or locations?
                    </span>
                    <span className="text-[12px] text-[#43474d] mt-0.5">
                      Helps us account for transition timing, transport, and simultaneous site setups.
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'Single session at one location', label: 'One event at one location', sub: null },
                      { id: 'Multiple sessions at one location', label: 'Multiple sessions at one location', sub: 'E.g., Ceremony & Reception' },
                      { id: 'Events across multiple locations', label: 'Events across multiple locations', sub: null },
                      { id: 'Not decided yet', label: 'Not decided yet', sub: null }
                    ].map(opt => {
                      const isSelected = formData.sessionComplexity === opt.id;
                      return (
                        <div key={opt.id} onClick={() => updateForm('sessionComplexity', opt.id)} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-[#fff2dd]' : 'bg-white'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#00142a] text-white' : 'bg-[#f6e6cb]'}`}>
                              {isSelected && <span className="material-symbols-outlined text-[10px]">check</span>}
                            </div>
                            <span className={`text-[15px] ${isSelected ? 'text-[#00142a] font-medium' : 'text-[#221b0a]'}`}>{opt.label}</span>
                          </div>
                          {opt.sub && <span className="text-[12px] text-[#805533]">{opt.sub}</span>}
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="flex flex-col gap-2 mb-7">
                  <div className="w-full bg-white rounded-xl p-7 flex flex-col gap-4 shadow-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-[#fbecd1]">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#805533] text-[20px]">overview</span>
                        <span className="font-serif text-[16px] text-[#00142a] font-medium">Your celebration at a glance</span>
                      </div>
                      <span className="text-[12px] text-[#805533]">Step 4 parameters</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2.5">
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-[#43474d]">Expected Guests</span>
                        <span className="text-[#00142a] font-medium">{formData.guestCount} attendees</span>
                      </div>
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-[#43474d]">Certainty</span>
                        <span className="text-[#00142a] font-medium">
                          {formData.guestCertainty === 'estimating' ? `Still estimating (${formData.guestRangeMin} - ${formData.guestRangeMax})` : 'Fairly certain'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-[#43474d]">Production Scale</span>
                        <span className="text-[#00142a] font-medium capitalize">{formData.eventScale} Celebration</span>
                      </div>
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-[#43474d]">Session Complexity</span>
                        <span className="text-[#00142a] font-medium text-right line-clamp-1 max-w-[200px]">{formData.sessionComplexity}</span>
                      </div>
                    </div>

                    <div className="mt-1 p-4 rounded-lg bg-[#fff2dd] flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#805533] text-[22px] shrink-0 mt-0.5">verified_user</span>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-[#00142a]">
                          Verified Planner Capacity Guarantee
                        </span>
                        <p className="text-[12px] text-[#43474d] mt-0.5 leading-relaxed">
                          We will exclusively route this brief to planning studios with audited credentials managing {formData.guestRangeMax || formData.guestCount}+ guests with dedicated logistical crews.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="w-full h-36 rounded-xl overflow-hidden relative mb-4 bg-[#fbecd1]">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY8ZjD0nEvSlkctXTaXUb7UGZdRfUZSML9tnZr0FWWqB4Kq0kGH5yn_I9wh-KG8N3dKvBlYSMjNYSNJH978jdz-rUqQZATXCin85FtcDrTBXGtYYoUHAP-GhQvkVQAEC-W5bBn02QvexD7x0JDeMzIFXJC5PpzpdYmirSDNblxkLolVbnMb6NBLN2-TnM9mC_fs4Uo8VW02iP9mUNn5D_R5r6cxYnPU5P4SI_duSRxFZUnwpqWgX142w" className="w-full h-full object-cover" alt="Editorial scene" />
                  <div className="absolute inset-0 bg-[#00142a]/20 backdrop-blur-[1px] flex items-end p-4">
                    <span className="font-serif text-[16px] text-white drop-shadow-sm">
                      “Atmosphere is made of scale, light, and quiet choreography.”
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[#43474d] mb-2">
                  <span className="material-symbols-outlined text-[14px] text-[#805533]">cloud_done</span>
                  <span className="text-[12px]">Draft saved automatically · Step 4 of 7</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SERVICES REQUIRED */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-[#221b0a]">
              <div className="flex flex-col gap-2 mb-5 mt-4">
                <h1 className="font-serif text-[28px] leading-[36px] text-[#00142a] tracking-tight">
                  What do you need for your event?
                </h1>
                <p className="text-[15px] text-[#43474d]">
                  Explore the services below, discover the possibilities, and select what you need. We'll use your choices to find planners whose capabilities match your event.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbecd1] text-[#43474d] text-[12px]">
                    <span className="material-symbols-outlined text-[15px] text-[#805533]">checklist</span>
                    Select all services that apply · Multi-select enabled
                  </span>
                </div>
              </div>

              {Object.entries(SERVICE_CATALOG).map(([catKey, catData], idx) => {
                const selectedInCat = formData.services[catKey] || [];
                return (
                  <section key={catKey} className="flex flex-col gap-3.5 mt-8">
                    <div className="flex items-start justify-between pb-1 border-b border-[#c3c6ce]/30">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#f6e6cb] text-[#805533] text-[11px] flex items-center justify-center font-bold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <h2 className="font-serif text-[20px] text-[#00142a]">{catData.title}</h2>
                        </div>
                        <p className="text-[12px] text-[#43474d] mt-0.5">{catData.desc}</p>
                      </div>
                      <span className={`text-[12px] shrink-0 pt-1 font-medium ${selectedInCat.length > 0 ? 'text-[#805533]' : 'text-[#43474d]'}`}>
                        {selectedInCat.length} selected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                      {catData.items.map(item => {
                        const isSelected = selectedInCat.includes(item.id);
                        const priorityIndex = formData.servicePriorities.indexOf(item.id);
                        return (
                          <div 
                            key={item.id}
                            onClick={() => toggleService(catKey, item.id)}
                            className={`group relative flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-2 border-[#0a2947] bg-[#fff2dd] shadow-sm' : 'border border-[#c3c6ce]/40 bg-white hover:border-[#c3c6ce]'}`}
                          >
                            {item.img ? (
                              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#f6e6cb]">
                                <img src={item.img} alt={item.id} className={`w-full h-full object-cover transition-transform duration-300 ${isSelected ? '' : 'group-hover:scale-105'}`} />
                                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-colors ${isSelected ? 'bg-[#00142a] text-white' : 'bg-white/90 text-transparent'}`}>
                                  <span className="material-symbols-outlined text-[16px]">check</span>
                                </div>
                                {priorityIndex !== -1 && (
                                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#805533] text-white text-[10px] font-bold shadow-xs uppercase tracking-wider">
                                    ★ Priority {priorityIndex + 1}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-colors ${isSelected ? 'bg-[#00142a] text-white' : 'border border-[#c3c6ce] text-transparent'}`}>
                                <span className="material-symbols-outlined text-[16px]">check</span>
                              </div>
                            )}
                            <div className={`p-4 flex flex-col flex-1 gap-1.5 ${isSelected ? 'bg-[#fff2dd]' : 'bg-white'} ${!item.img ? 'justify-center min-h-[120px]' : 'justify-between'}`}>
                              <h3 className={`${!item.img ? 'text-[18px] pr-8' : 'text-[14px]'} font-medium text-[#00142a] leading-tight`}>{item.id}</h3>
                              <p className={`${!item.img ? 'text-[14px]' : 'text-[12px]'} text-[#43474d] line-clamp-2 mt-1`}>{item.desc}</p>
                              {!item.img && priorityIndex !== -1 && (
                                <div className="mt-2">
                                  <span className="px-2.5 py-1 rounded bg-[#805533] text-white text-[11px] font-bold shadow-xs uppercase tracking-wider">
                                    ★ Priority {priorityIndex + 1}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}

              <section className="mt-10 p-5 rounded-2xl bg-[#fff2dd] border border-[#c3c6ce]/30 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[#805533]">
                    <span className="material-symbols-outlined text-[18px]">grade</span>
                    <span className="text-[11px] uppercase tracking-wider font-semibold">Key Focus</span>
                  </div>
                  <h2 className="font-serif text-[20px] text-[#00142a]">
                    Which services matter most to you?
                  </h2>
                  <p className="text-[13px] text-[#43474d]">
                    Choose up to three priorities so we can understand what matters most for your event.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-1">
                  {Object.values(formData.services).flat().map(serviceName => {
                    const pIdx = formData.servicePriorities.indexOf(serviceName as string);
                    const isPrioritized = pIdx !== -1;
                    return (
                      <button 
                        key={serviceName as string}
                        onClick={() => togglePriority(serviceName as string)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[14px] transition-all shadow-sm ${isPrioritized ? 'bg-[#00142a] text-white' : 'bg-white border border-[#c3c6ce]/40 text-[#221b0a] hover:bg-[#fbecd1]'}`}
                        type="button"
                      >
                        {isPrioritized ? (
                          <span className="w-5 h-5 rounded-full bg-[#805533] text-white text-[11px] flex items-center justify-center font-bold">
                            {pIdx + 1}
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-[#fbecd1] text-[#43474d] text-[11px] flex items-center justify-center">
                            +
                          </span>
                        )}
                        <span>{serviceName as string}</span>
                        {isPrioritized && <span className="material-symbols-outlined text-[16px] text-[#fdc39a]">check</span>}
                      </button>
                    );
                  })}
                  {Object.values(formData.services).flat().length === 0 && (
                    <span className="text-[13px] text-[#805533] italic">Select some services above first.</span>
                  )}
                </div>
              </section>

              <section className="mt-8 flex flex-col gap-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase text-[#43474d] font-semibold tracking-wider">
                    Anything else you need?
                  </span>
                  <span className="font-serif text-[20px] text-[#00142a]">
                    Bespoke Details or Requests
                  </span>
                </label>
                <div className="relative w-full mt-1">
                  <textarea 
                    value={formData.additionalNotes}
                    onChange={(e) => updateForm('additionalNotes', e.target.value)}
                    className="w-full p-4 rounded-xl bg-white border border-[#c3c6ce]/40 text-[#221b0a] placeholder:text-[#43474d]/40 text-[15px] focus:border-[#00142a] outline-none transition-colors shadow-sm resize-none" 
                    placeholder="Tell us about any additional services or specific requirements not listed above..." 
                    rows={4}
                  ></textarea>
                </div>
                <span className="text-[12px] text-[#43474d] pl-1">
                  Optional — you can provide more details here.
                </span>
              </section>

              <section className="mt-8 flex flex-col gap-4 mb-8">
                <div className="p-5 rounded-2xl bg-[#fbecd1] border border-[#c3c6ce]/30 flex flex-col gap-3.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-[#00142a]">bookmark</span>
                      <span className="text-[14px] text-[#00142a] font-semibold">Your Selected Services</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f0e1c6] text-[#805533] text-[11px] font-medium uppercase tracking-wider">
                      {Object.values(formData.services).flat().length} Selected
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {Object.values(formData.services).flat().map(serviceName => {
                      const pIdx = formData.servicePriorities.indexOf(serviceName as string);
                      return (
                        <span key={serviceName as string} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#c3c6ce]/30 text-[#221b0a] text-[13px] shadow-xs">
                          {serviceName as string}
                          {pIdx !== -1 && (
                            <span className="text-[#805533] text-[10px] font-bold uppercase tracking-wider">★ Priority {pIdx + 1}</span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 text-[#43474d] text-[12px]">
                    <span className="text-[#805533] font-bold">★</span>
                    <span>Marked as Top Priority for matched agency evaluation</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f6e6cb]/60 border border-[#c3c6ce]/30 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[20px] text-[#805533] mt-0.5 shrink-0">verified_user</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] text-[#00142a] font-semibold">Verified Planner Compatibility Guarantee</span>
                    <p className="text-[12px] text-[#43474d] leading-relaxed">
                      Brief will be routed exclusively to planning studios with verified in-house talent or vetted vendor networks for all selected categories.
                    </p>
                  </div>
                </div>
              </section>

              <div className="flex items-center justify-center gap-1.5 text-[#43474d] mb-2 pb-4">
                <span className="material-symbols-outlined text-[14px] text-[#805533]">cloud_done</span>
                <span className="text-[12px]">Draft saved automatically · Step 5 of 7</span>
              </div>
            </div>
          )}

          {/* STEP 6: BUDGET */}
          {currentStep === 6 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-[#221b0a]">
              {/* Editorial Header & Reassurance */}
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-1.5 text-[#805533]">
                  <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                  <span className="font-label-caps text-[11px] uppercase tracking-wider font-semibold">Financial Framework</span>
                </div>
                <h1 className="font-serif text-[28px] leading-[36px] text-[#00142a] tracking-tight">
                  What is your event budget?
                </h1>
                <p className="text-[15px] text-[#43474d]">
                  Share your estimated budget so we can match you with planners who fit your event scale and aesthetic vision.
                </p>

                {/* Reassurance Note Card */}
                <div className="bg-[#fff2dd] p-4 rounded-xl flex items-start gap-2 shadow-sm mt-2">
                  <span className="material-symbols-outlined text-[#805533] shrink-0 text-[20px] mt-0.5">verified_user</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] text-[#00142a] font-semibold">Honest Pricing Guarantee</span>
                    <p className="text-[13px] text-[#43474d] leading-relaxed">
                      Your budget helps us curate suitable proposals. It does not commit you to spending the full amount. This reflects your total anticipated spend, not solely the planner's direct fee.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section A: Total Event Budget */}
              <section className="flex flex-col gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] uppercase text-[#805533] font-semibold tracking-wider">Section A · Scale</span>
                  <h2 className="font-serif text-[20px] text-[#00142a]">What is your total event budget?</h2>
                  <p className="text-[13px] text-[#43474d]">
                    Consider the overall amount you expect to allocate across all suppliers and coordination.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {BUDGET_TIERS.map(tier => {
                    const isSelected = formData.budgetTier === tier.id;
                    return (
                      <label 
                        key={tier.id}
                        onClick={() => {
                          updateForm('budgetTier', tier.id);
                          updateForm('budgetMin', tier.min);
                          updateForm('budgetMax', tier.max);
                        }}
                        className={`relative flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all shadow-sm ${isSelected ? 'bg-[#0a2947] text-white shadow-md' : 'bg-white hover:bg-[#fff2dd]'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'bg-white' : 'bg-[#fbecd1]'}`}>
                            {isSelected ? (
                              <span className="material-symbols-outlined text-[#00142a] text-[14px] font-bold">check</span>
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-transparent"></div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-[15px] ${isSelected ? 'font-semibold text-white' : 'text-[#221b0a]'}`}>{tier.label}</span>
                            {isSelected && <span className="text-[12px] text-[#7791b4] mt-0.5">{tier.desc}</span>}
                          </div>
                        </div>
                        {isSelected ? (
                          <span className="text-[11px] bg-white/10 text-white px-2 py-0.5 rounded-full uppercase font-semibold">Selected</span>
                        ) : (
                          <span className="text-[12px] text-[#43474d]">{tier.desc}</span>
                        )}
                      </label>
                    );
                  })}

                  {/* Enter a custom budget toggle option */}
                  <div className="flex flex-col rounded-lg bg-[#fff2dd] p-4 gap-3 shadow-sm mt-1">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => {
                        updateForm('budgetTier', 'custom');
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#805533] text-[20px]">tune</span>
                        <span className="text-[15px] text-[#00142a] font-medium">Specify a custom bracket (in Lakhs)</span>
                      </div>
                      <span className="text-[11px] uppercase text-[#805533] font-semibold">Optional Input</span>
                    </div>

                    {formData.budgetTier === 'custom' && (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] uppercase text-[#43474d] font-semibold">Min Budget (L)</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-[#43474d] font-medium">L</span>
                            <input 
                              className="w-full bg-white text-[#00142a] text-[15px] pl-7 pr-3 py-2 rounded-lg outline-none focus:border-[#00142a] border border-[#c3c6ce]/30" 
                              placeholder="e.g. 5" 
                              type="number" 
                              step="0.1"
                              value={formData.budgetMin}
                              onChange={(e) => updateForm('budgetMin', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] uppercase text-[#43474d] font-semibold">Max Budget (L)</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-[#43474d] font-medium">L</span>
                            <input 
                              className="w-full bg-white text-[#00142a] text-[15px] pl-7 pr-3 py-2 rounded-lg outline-none focus:border-[#00142a] border border-[#c3c6ce]/30" 
                              placeholder="e.g. 10" 
                              type="number"
                              step="0.1"
                              value={formData.budgetMax}
                              onChange={(e) => updateForm('budgetMax', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <p className="text-[12px] text-[#43474d] italic mt-1">
                      Enter exact or estimated range in Lakhs (e.g. 5.5 for ₹5,50,000). Non-overlapping boundaries captured for matching engine calibration.
                    </p>
                  </div>

                  {/* I'm not sure yet */}
                  <label 
                    onClick={() => {
                      updateForm('budgetTier', 'not_sure');
                      updateForm('budgetMin', '');
                      updateForm('budgetMax', '');
                    }}
                    className="relative flex items-center justify-between p-4 rounded-lg bg-white cursor-pointer hover:bg-[#fff2dd] transition-colors shadow-sm mt-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#fbecd1] flex items-center justify-center">
                        {formData.budgetTier === 'not_sure' ? (
                          <div className="w-2 h-2 rounded-full bg-[#00142a]"></div>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-transparent"></div>
                        )}
                      </div>
                      <span className={`text-[15px] ${formData.budgetTier === 'not_sure' ? 'text-[#00142a] font-medium' : 'text-[#43474d]'}`}>I'm not sure yet — guide me</span>
                    </div>
                    <span className="material-symbols-outlined text-[#74777e] text-[18px]">help_outline</span>
                  </label>
                </div>
              </section>

              {/* Visual Divider */}
              <div className="h-0.5 bg-[#f6e6cb] rounded-full w-full"></div>

              {/* Section B: What Does Your Budget Include? */}
              <section className="flex flex-col gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] uppercase text-[#805533] font-semibold tracking-wider">Section B · Allocations</span>
                  <h2 className="font-serif text-[20px] text-[#00142a]">What should this budget cover?</h2>
                  <p className="text-[13px] text-[#43474d]">
                    Select which services are rolled into this figure so planners gauge direct vendor scope.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {BUDGET_INCLUSIONS.map(inc => {
                    const isSelected = formData.budgetIncludes.includes(inc);
                    return (
                      <button 
                        key={inc}
                        onClick={() => toggleBudgetInclude(inc)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] shadow-sm transition-colors ${isSelected ? 'bg-[#00142a] text-white' : 'bg-white text-[#221b0a] hover:bg-[#f6e6cb]'}`}
                        type="button"
                      >
                        <span className={`material-symbols-outlined text-[16px] ${isSelected ? '' : 'text-[#74777e]'}`}>
                          {isSelected ? 'check' : 'add'}
                        </span>
                        <span>{inc}</span>
                      </button>
                    );
                  })}
                  
                  <button 
                    onClick={() => toggleBudgetInclude('all')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white text-[#221b0a] hover:bg-[#f6e6cb] transition-colors text-[13px] shadow-sm ml-2 border border-[#c3c6ce]/30"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#74777e]">done_all</span>
                    <span>All expenses inclusive</span>
                  </button>
                </div>
                
                <p className="text-[12px] text-[#43474d] flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-[15px] text-[#805533]">info</span>
                  This ensures planners calculate scope accurately without penalizing multi-vendor setups.
                </p>
              </section>

              {/* Visual Divider */}
              <div className="h-0.5 bg-[#f6e6cb] rounded-full w-full"></div>

              {/* Section C: Budget Flexibility */}
              <section className="flex flex-col gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] uppercase text-[#805533] font-semibold tracking-wider">Section C · Margin</span>
                  <h2 className="font-serif text-[20px] text-[#00142a]">How flexible is your budget?</h2>
                  <p className="text-[13px] text-[#43474d]">
                    Indicate your appetite for scope expansions if an exceptional creative concept emerges.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  {FLEXIBILITY_OPTIONS.map(opt => {
                    const isSelected = formData.budgetFlexibility === opt.id;
                    return (
                      <div 
                        key={opt.id}
                        onClick={() => updateForm('budgetFlexibility', opt.id)}
                        className={`p-4 rounded-lg shadow-sm flex items-start gap-3 cursor-pointer transition-colors ${isSelected ? 'bg-[#fbecd1] text-[#00142a]' : 'bg-white hover:bg-[#fff2dd]'}`}
                      >
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-1 ${isSelected ? 'bg-[#00142a]' : 'bg-[#fbecd1]'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <span className="text-[14px] text-[#00142a] font-semibold">{opt.label}</span>
                            {isSelected && <span className="text-[11px] bg-[#ffdcc5] text-[#301400] px-2 py-0.5 rounded-full uppercase font-semibold">Selected</span>}
                          </div>
                          <span className={`text-[13px] ${isSelected ? 'text-[#221b0a]' : 'text-[#43474d]'}`}>{opt.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Visual Divider */}
              <div className="h-0.5 bg-[#f6e6cb] rounded-full w-full"></div>

              {/* Section D: Optional Additional Notes */}
              <section className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase text-[#805533] font-semibold tracking-wider">Section D · Nuances</span>
                  <span className="text-[12px] text-[#43474d]">Optional</span>
                </div>
                <h2 className="font-serif text-[20px] text-[#00142a]">Anything else we should know?</h2>
                <textarea 
                  value={formData.budgetNotes}
                  onChange={(e) => updateForm('budgetNotes', e.target.value)}
                  className="w-full bg-white text-[#00142a] placeholder:text-[#43474d]/50 p-4 rounded-lg text-[13px] outline-none border border-[#c3c6ce]/30 focus:border-[#00142a] shadow-sm mt-1 resize-none" 
                  placeholder="E.g., I can stretch my budget for exceptional decoration, or I already have a venue booked and paid directly..." 
                  rows={3}
                ></textarea>
                <span className="text-[12px] text-[#43474d]">
                  Provide context on advance deposits or pre-selected vendors already contracted.
                </span>
              </section>

              {/* Visual Accent */}
              <div className="rounded-xl overflow-hidden bg-[#fff2dd] shadow-sm flex flex-col mt-4">
                <div className="relative h-44 w-full">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Atelier Mood Inspiration" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBNLjnKBXUCAU2l0ifx1uzaRPvlezv7-6l2PUxMmCOG041AbqyAEKyofHDj31RhmIgNtpg-WDybyeiHZhRNdN1QpF5f4pMm0kVeRPkJ87JpQXospk0RK7FvcuRlBHXoFcnmV5n_mhIT4iy9pB2qpvuGdV9inHp3My1bGi8C3WgiuuY2pMoIMWmC7Rgzw-IctSLQ8czY3Tg1hw_TmDJ84ECyYUXG_1Zw4dAQHkUkXrnm2GyUCdojDu-mg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00142a]/80 via-transparent to-transparent flex items-end p-4">
                    <span className="font-serif text-[20px] text-white italic">Every rupee directed with intention.</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Budget Summary Card */}
              <div className="bg-[#fbecd1] p-6 rounded-xl flex flex-col gap-4 shadow-sm mt-4 mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#805533] text-[20px]">analytics</span>
                    <span className="font-serif text-[20px] text-[#00142a]">Your Budget Overview</span>
                  </div>
                  <span className="text-[11px] uppercase text-[#805533] font-semibold tracking-wider">Step 6 Draft</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2 bg-white p-4 rounded-lg">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[13px] text-[#43474d]">Target Range</span>
                    <span className="text-[14px] text-[#00142a] font-semibold">
                      {formData.budgetTier === 'not_sure' ? 'To Be Determined' : (formData.budgetMin ? `${formData.budgetMin}L - ${formData.budgetMax || formData.budgetMin}L` : 'Not Set')}
                    </span>
                  </div>
                  <div className="h-px bg-[#f6e6cb] w-full"></div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[13px] text-[#43474d]">Flexibility</span>
                    <span className="text-[13px] text-[#00142a]">
                      {FLEXIBILITY_OPTIONS.find(o => o.id === formData.budgetFlexibility)?.label || 'Not Set'}
                    </span>
                  </div>
                  <div className="h-px bg-[#f6e6cb] w-full"></div>
                  <div className="flex justify-between items-start py-1">
                    <span className="text-[13px] text-[#43474d]">Included Scope</span>
                    <span className="text-[13px] text-[#00142a] text-right max-w-[60%]">
                      {formData.budgetIncludes.length > 0 ? (formData.budgetIncludes.length === BUDGET_INCLUSIONS.length ? 'All Inclusive' : formData.budgetIncludes.slice(0, 3).join(', ') + (formData.budgetIncludes.length > 3 ? '...' : '')) : 'Not Set'}
                    </span>
                  </div>
                  <div className="h-px bg-[#f6e6cb] w-full"></div>
                  <div className="flex justify-between items-start py-1">
                    <span className="text-[13px] text-[#43474d]">Top Priorities</span>
                    <span className="text-[13px] text-[#00142a] text-right">
                      {formData.servicePriorities.length > 0 ? formData.servicePriorities.map((p, i) => `#${i+1} ${p}`).join(' · ') : 'None Set'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[#43474d]">
                  <span className="material-symbols-outlined text-[16px] text-[#805533]">handshake</span>
                  <span className="text-[12px]">Celebrate Matching Policy: Match ≠ Obligation to hire. Receive curated plans first.</span>
                </div>
              </div>

              {/* Fair Matching Guarantee Banner */}
              <div className="flex items-center gap-3 bg-[#ffdcc5]/50 p-4 rounded-lg mt-2 mb-8">
                <span className="material-symbols-outlined text-[#653d1e] text-[22px] shrink-0">verified</span>
                <p className="text-[12px] text-[#653d1e]">
                  <strong>Celebrate Fair Matching Guarantee:</strong> Your brief is dispatched only to verified planners who match your financial bracket with 0% commission markups.
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[#43474d] mb-2 pb-4">
                <span className="material-symbols-outlined text-[14px] text-[#805533]">cloud_done</span>
                <span className="text-[12px]">Draft saved automatically · Step 6 of 7</span>
              </div>
            </div>
          )}

          {/* STEP 7: LOOK & FEEL */}
          {currentStep === 7 && activeConfig && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-serif text-celebrate-navy">Look & Feel</h2>
              <p className="text-celebrate-navy/70">Define the visual identity of your event.</p>
              
              <div className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-celebrate-navy mb-2">Overall Style</label>
                  <StyleCarousel 
                    eventType={formData.type}
                    styles={activeConfig.styles}
                    selectedStyle={formData.style}
                    onSelect={(styleName) => updateForm('style', styleName)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-celebrate-navy mb-4">Preferred Colors / Theme</label>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 bg-celebrate-cream/30 p-6 rounded-2xl border border-celebrate-navy/5">
                    <HexColorPicker color={themeColorHex} onChange={handleColorChange} />
                    <div className="flex flex-col items-center justify-center space-y-4 pt-4 sm:pt-0">
                      <div 
                        className="w-24 h-24 rounded-full border-4 border-white shadow-md transition-colors duration-200"
                        style={{ backgroundColor: themeColorHex }}
                      />
                      <div className="text-center">
                        <span className="block text-xs font-bold text-celebrate-navy/50 uppercase tracking-wider mb-1">Semantic Match</span>
                        <span className="block text-xl font-serif text-celebrate-navy">
                          {formData.colors || 'Terracotta'}
                        </span>
                        <span className="block text-sm text-celebrate-navy/60 font-mono mt-1">
                          {themeColorHex.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-celebrate-navy mb-2">Reference Image</label>
                  
                  {formData.referenceMedia.length === 0 ? (
                    <label className="w-full border-2 border-dashed border-celebrate-navy/20 rounded-2xl p-8 flex flex-col items-center justify-center bg-celebrate-cream/30 hover:bg-celebrate-cream/50 transition-colors cursor-pointer min-h-[200px]">
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                      <UploadCloud className="w-8 h-8 text-celebrate-navy/40 mb-3" />
                      <p className="text-sm font-medium text-celebrate-navy">Click to upload reference image</p>
                      <p className="text-xs text-celebrate-navy/50 mt-1">PNG, JPG up to 5MB</p>
                    </label>
                  ) : (
                    <div className="relative group w-full">
                      <label className="block w-full border-2 border-dashed border-celebrate-navy/20 rounded-2xl overflow-hidden cursor-pointer bg-celebrate-cream/30">
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg" 
                          className="hidden" 
                          onChange={handleFileUpload}
                        />
                        <img 
                          src={URL.createObjectURL(formData.referenceMedia[0])} 
                          alt="preview" 
                          className="w-full object-cover max-h-[400px]" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-medium flex items-center gap-2">
                            <UploadCloud className="w-5 h-5" /> Change Image
                          </p>
                        </div>
                      </label>
                      <button 
                        type="button"
                        onClick={() => removeFile(0)}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-celebrate-terracotta text-white rounded-full text-lg font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex items-center justify-between pt-6 border-t border-celebrate-navy/5">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className={currentStep === 1 ? 'invisible' : ''}
            disabled={isSubmitting}
          >
            Previous
          </Button>
          
          <Button onClick={handleNext} disabled={isSubmitting} className="shadow-lg shadow-celebrate-navy/10 group">
            {isSubmitting ? 'Saving...' : currentStep === STEPS.length ? 'Submit Requirements' : 'Continue'}
            {!isSubmitting && currentStep < STEPS.length && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />}
          </Button>
        </div>
      </div>

    </div>
  );
};
