const fs = require('fs');

const doujinText = `subculture_shock
premium_lingerie_trap
ogami_otoshi
killer_nee_chan
love_aya_dokidoki_shuzai_ryokou
resort_lover
teachers_cabinet
country_girl_daigo
daisuki_na_mama_to_akachan
akogare_no_tsunadesama
evil_leader_and_the_virgin_members
excite
s_type_moms_strict_baby_making
the_lady_down_the_street
glamorous
rumor_gal_nomotosan
flat_chest_girlfriend_and_clingy_boyfriend
lets_play_with_oneechan_ishizuchi_ginko
rinko_no_ana
harvest_moon
gungun_no_kyuujitsu
chiyukisensei_no_ojikan_omake
gardevoir
firsttime_at_a_love_hotel
fun_babysitter
sexual_punishment
nyotengu_to_nobetsu_makunashi
a_tribute_to_teacher
tequila
megamisama_to_nobetsumakunashi
cool_break
chijou_no_hoshi_toramaru_shou
kayoi_zumama
manga_club
zangyou_de_good_job
keitai_de_good_job
not_weaning
summertime_bus_stop
a_full_400cc_of_love
sexchange
queens_game
im_yours_muririn
oideyo_pink_chaldea
shuffle_relations
sensei_to_bitch
ore_to_shiburin_to_one_room
the_promise_made_inside_the_library
wise_ass
mirumiru_diet
sono_wonna_fushidara_ni_tsuki
pink_trash
my_large_girlfriend
kayoi_haha
haha_to_issho_ni
ougon_taiken
fukanzen_renai_ki_ni_naru_hito_wa_kanojo_no_hahaoya
lets_do_5p
my_mom_used_to_be_a_slut
a_book_where_i_make_love_with_izmir_in_a_kotasu
getting_lewd_with_you
taste_of_honey
adaltery_mashi
cheat_be_Cheated_family_plan
i_wanna_do_it_with_mom_too
pretty_cosplay_mama_is_staying_with_me
saimin_seikatsu
loveho_de_go
double_helix_of_her_and_older_sister
yukatakkusu
elf_twins_control
elf_x_orc_control
dark_elf_control
breast_swaying_raikou
seiso_bitch_control
leave_it_to_me
summer_game_yoshida
the_autumn_confession
fallen_queen
between_the_bookshelves
natsuiro_tsubame
love_love_mira_bitch
my_very_own_iron_mask_sis
hatsujou_lovers
let_me_bark_for_you
idol_no_care_o_suru_no_mo
chibusa_sensei_celebration
`;

const splittedList = doujinText.split("\n").map(t => t.replace("\t")).filter(t => t);

const doujinList = Array.from(new Set(splittedList));

const doujinListObject = { doujinList };

fs.writeFile('./doujinList.json', JSON.stringify(doujinListObject, null, 4), (err) => {
	if (err) throw err;
})