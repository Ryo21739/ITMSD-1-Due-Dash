import { router } from 'expo-router';
import { BookOpen, ChartNoAxesCombined } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CourseCard } from '@/components/cards/CourseCard';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeading } from '@/components/common/SectionHeading';
import { AppScreen } from '@/components/layout/AppScreen';
import { colors } from '@/constants/colors';
import { type } from '@/constants/typography';
import { useAppData } from '@/hooks/use-app-data';
import { atTime, formatCourseDue } from '@/lib/dates';
import { dueThisWeek, openOnly, sortByDue } from '@/lib/selectors';

export default function CoursesScreen() {
  const { data } = useAppData();
  const now = new Date();

  const open = openOnly(data.assignments);
  const week = dueThisWeek(data.assignments, now);
  const cards = data.courses.filter((course) => course.featured);

  return (
    <AppScreen
      title="My courses"
      subtitle="Fall semester · 2026"
      rightIcon={ChartNoAxesCombined}
      rightLabel="Open progress"
      onRightPress={() => router.push('/progress')}
      active="courses"
      topPadding={26}
      gap={20}>
      <View style={styles.summary}>
        <BookOpen size={24} color={colors.primary} strokeWidth={1.5} />
        <View style={styles.summaryCopy}>
          <Text style={[type.body14, styles.summaryTitle]}>
            {`${cards.length} courses. One clear view.`}
          </Text>
          <Text style={[type.note11, styles.summaryBody]}>
            {`${week.length} assignment${week.length === 1 ? '' : 's'} · due this week`}
          </Text>
        </View>
      </View>

      <SectionHeading
        title="Course workload"
        trailing={`${open.length} assignments total`}
      />

      {cards.length === 0 ? (
        <EmptyState message="No courses yet." />
      ) : (
        <View style={styles.list}>
          {cards.map((course) => {
            const next = sortByDue(open.filter((item) => item.courseId === course.id))[0];
            const nextDue = atTime(now, course.nextOffset, course.nextTime.h, course.nextTime.m);
            return (
              <CourseCard
                key={course.id}
                code={course.code}
                title={next?.title ?? course.nextTitle ?? course.name}
                completed={course.completed}
                percent={course.percent}
                nextTitle={course.nextTitle}
                nextDue={formatCourseDue(nextDue, now)}
                onPress={() =>
                  router.push({ pathname: '/assignments', params: { course: course.id } })
                }
              />
            );
          })}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.mint,
  },
  summaryCopy: {
    flex: 1,
    gap: 4,
  },
  summaryTitle: {
    color: colors.ink,
  },
  summaryBody: {
    color: colors.primaryDeep,
  },
  list: {
    gap: 12,
  },
});
